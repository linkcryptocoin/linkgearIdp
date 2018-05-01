'use strict';

const { hashSync, compareSync, genSaltSync } = require('bcrypt-nodejs');
const { randomBytes } = require('crypto');
const LocalStrategy = require('passport-local').Strategy;
const nodeify = require('nodeify');

const SALT_ROUNDS = 10;

const HOUR = 1000 * 60 * 60;

const tests = {
    username: {
        regex: /^[a-z][0-9a-z_]{3,19}$/,
        error: 'Username must be all lowercase, contain only letters, numbers and _ (starting with a letter), and be between 4 and 20 characters long.'
    },
    password: {
        test: password => /\d/.test(password) && /[a-z]/.test(password) && /[A-Z]/.test(password) && /.{6,}/.test(password),
        error: 'Password must contain digits, lowercase and uppercase letters and be at least 6 characters long.'
    },
    email: {
        regex: /^.+@.+$/,
        error: 'Invalid email.'
    }
};

const linkgearaccount = require('./linkgearaccount.js')
linkgearaccount.web3init();

function testValue(key, value) {
    const test = tests[key];
    if (test.regex) {
        if (!test.regex.test(value)) {
            throw new Error(test.error);
        }
    } else {
        if (!test.test(value)) {
            throw new Error(test.error);
        }
    }
}

function randomToken() {
    return randomBytes(43).toString('hex');
}

function nodeifyAsync(asyncFunction) {
    return function (...args) {
        return nodeify(asyncFunction(...args.slice(0, -1)), args[args.length - 1]);
    };
}

function hash(pass) {
    return hashSync(pass, genSaltSync(SALT_ROUNDS));
}

module.exports = function ({
    onRegister,
    onGenerateVerificationToken,
    onSetEmail,
    onVerify,
    onForgotPassword,
    onResetPassword,
    onLinkAccount,
    onChangePassword
}) {
    return function ({
        name,
        registerPassportMethod,
        registerMethod,
        registerUniqueField,
        registerProfileField,
        getProfile,
        getUserByUniqueField,
        getUserById,
        getUserByFields,
        getUniqueField,
        updateUser,
        insertUser,
        requireLogged,
        requireNotLogged,
        requireNotRegistered,
        requireRegisteredWithThis
    }) {

        registerUniqueField('username', 'username');
        registerUniqueField('email', 'email');
        registerProfileField('username');
        registerProfileField('email');
        registerProfileField('verified');
        registerProfileField('account');

        registerPassportMethod('login', requireNotLogged, new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, nodeifyAsync((username, password) => {
            return getUserByUniqueField('username', username).then(user => {
                if (!user) {
                    return getUserByUniqueField('email', username);
                } else {
                    return user;
                }
            }).then(user => {
                if (!user) {
                    throw new Error('Incorrect email or username.');
                }

                if (!user[name]) {
                    throw new Error('No password associated with this account.');
                }

                if (!compareSync(password, user[name].password)) {
                    throw new Error('Incorrect password.');
                }

                return user;
            });
        })));

        registerMethod('set-username', requireLogged, function (req, res) {
            const { username } = req.body;

            if (typeof username !== 'string') {
                throw new Error('Invalid username.');
            }

            testValue('username', username);

            return getUserByUniqueField('username', username).then(user => {
                if (user) {
                    throw new Error('This username is already registered.');
                }

                updateUser(req.user._id, {
                    username
                }).then(() => {
                    return getUserById(req.user._id);
                }).then(user => {
                    return res.send({
                        message: 'Username updated.',
                        user: getProfile(user)
                    });
                });
            });
        });

        registerMethod('set-email', requireLogged, function (req, res) {
            const { email } = req.body;

            if (typeof email !== 'string') {
                throw new Error('Invalid email.');
            }

            testValue('email', email);

            return getUserByUniqueField('email', email).then(user => {
                if (user && user._id !== req.user._id) {
                    throw new Error('This email is already registered.');
                }

                const verificationToken = randomToken();

                updateUser(req.user._id, {
                    email,
                    verificationToken: hash(verificationToken),
                    verificationTokenExpiresAt: new Date(Date.now() + HOUR)
                }).then(() => {
                    if (onSetEmail) {
                        onSetEmail({
                            _id: req.user._id,
                            email,
                            verificationToken
                        });
                    }
                    return getUserById(req.user._id);
                }).then(user => {
                    return res.send({
                        message: 'Email updated.',
                        user: getProfile(user)
                    });
                });
            });
        });

        registerMethod('register', requireNotLogged, function (req, res) {
            const { email, password, account } = req.body;

            if (typeof email !== 'string') {
                throw new Error('Invalid email');
            }
            if (typeof password !== 'string') {
                throw new Error('Invalid password');
            }

            testValue('password', password);

            // Validate the account if an account is passed
            if (account && !linkgearaccount.isAddress(account))
                throw new Error(`Invalid Linkgear Account ${account}`);

            return getUserByUniqueField('email', email).then(user => {
                if (user) {
                    throw new Error('This email is already registered.');
                }
                 
                // Linkgear Account
                const linkgearAccount = account? account : 
                                        linkgearaccount.get(password); 

                const verificationToken = randomToken();
                const hashedPassword = hash(password);
                insertUser({
                    email,
                    password: hashedPassword,
                    account: linkgearAccount,
                    verificationToken: hash(verificationToken),
                    verificationTokenExpiresAt: new Date(Date.now() + HOUR)
                }).then(_id => {
                    if (onRegister) {
                        onRegister({
                            _id,
                            email,
                            verificationToken
                        });
                    }
                });

                res.send({
                    message: 'User registered successfully.'
                });
            });
        });

        registerMethod('generate-verification-token', requireRegisteredWithThis, function (req, res) {
            const verificationToken = randomToken();

            const user = req.user;

            if (!user[name] || !user[name].email) {
                throw new Error('No email to verify');
            }

            return updateUser(req.user._id, {
                verificationToken: hash(verificationToken),
                verificationTokenExpiresAt: new Date(Date.now() + HOUR)
            }).then(() => {
                if (onGenerateVerificationToken) {
                    onGenerateVerificationToken({
                        _id: user._id,
                        email: user[name].email,
                        verificationToken
                    });
                }

                res.send({token: verificationToken,
                    message: 'Verification token generated.'
                });
            });
        });

        registerMethod('verify', function (req, res) {

            const { userId, token } = req.body;

            if (!userId) {
                throw new Error('userId required.');
            }

            if (!token) {
                throw new Error('Verification token required.');
            }

            return getUserById(userId).then(user => {

                if (!user) {
                    throw new Error('User does not exist.');
                }

                if (!user[name] || !user[name].email) {
                    // No email to verify, but let's not leak this information
                    throw new Error('Verification token invalid, expired or already used.');
                }

                if (!compareSync(token, user[name].verificationToken)) {
                    throw new Error('Verification token invalid, expired or already used.');
                }

                if (!user[name].verificationTokenExpiresAt) {
                    throw new Error('Verification token invalid, expired or already used.');
                }

                if (new Date() >= user[name].verificationTokenExpiresAt) {
                    throw new Error('Verification token invalid, expired or already used.');
                }

                return updateUser(user._id, {
                    verified: true,
                    verificationToken: null
                }).then(() => {
                    return getUserById(user._id);
                }).then(user => {

                    if (onVerify) {
                        onVerify({
                            _id: user._id,
                            email: user[name].email
                        });
                    }

                    return res.send({
                        message: 'Email verified',
                        user: getProfile(user)
                    });
                });
            });
        });

        registerMethod('forgot-password', requireNotLogged, function (req, res) {
            const { username } = req.body;

            if (!username || typeof username !== 'string') {
                throw new Error('Invalid username or email.');
            }

            return getUserByUniqueField('username', username).then(user => {
                if (!user) {
                    return getUserByUniqueField('email', username);
                }

                return user;
            }).then(user => {
                if (!user) {
                    throw new Error('Invalid username or email.');
                }

                const email = getUniqueField(user, 'email');

                const passwordResetToken = randomToken();

                updateUser(user._id, {
                    passwordResetToken: hash(passwordResetToken),
                    passwordResetTokenExpiresAt: new Date(Date.now() + HOUR),
                    email
                }).then(() => {

                    if (onForgotPassword) {
                        onForgotPassword({
                            _id: user._id,
                            email,
                            passwordResetToken
                        });
                    }

                    return res.send({token: passwordResetToken,
                        message: 'Password reset token generated'
                    });
                });
            });
        });

        registerMethod('reset-password', requireNotLogged, function (req, res) {
            const { userId, token, newPassword } = req.body;
            if (!userId) {
                throw new Error('userId is required.');
            }

            if (!token) {
                throw new Error('token is required.');
            }

            if (!newPassword || !typeof newPassword === 'string') {
                throw new Error('Invalid password.');
            }

            testValue('password', newPassword);

            return getUserById(userId).then(user => {
                if (!user) {
                    throw new Error('User does not exist.');
                }

                if (!user[name] || !user[name].passwordResetToken) {
                    // No password to reset, but let's not leak this information
                    throw new Error('Password reset token invalid, expired or already used.');
                }

                if (!compareSync(token, user[name].passwordResetToken)) {
                    throw new Error('Password reset token invalid, expired or already used.');
                }

                if (!user[name].passwordResetTokenExpiresAt) {
                    throw new Error('Password reset token invalid, expired or already used.');
                }

                if (new Date() >= user[name].passwordResetTokenExpiresAt) {
                    throw new Error('Password reset token invalid, expired or already used.');
                }

                return updateUser(user._id, {
                    passwordResetToken: null,
                    password: hash(newPassword)
                }).then(() => {
                    if (onResetPassword) {
                        onResetPassword({
                            _id: user._id,
                            email: user[name].email
                        });
                    }
                    return res.send({
                        message: 'Password has been reset.'
                    });
                });
            });
        });

        // Link the account - smart contract
        //
        registerMethod('t-add', requireLogged, function (req, res) {
            const {amount1, amount2} = req.body;
            const result = parseFloat(amount1) + parseFloat(amount2);                   
            return res.send({ message: 'Add for testing', result: result });
        });
        
        registerMethod('t-getTokenBalance', requireLogged, function (req, res) {
           const {addr} = req.body; 
           const result = (addr)? linkgearaccount.getTokenBalance(addr) 
                               : 0;
           return res.send({ message: 'Token balance:', result: result });
        });        

        registerMethod('t-getBalance', requireLogged, function (req, res) {
           const {account} = req.body; 
           const result = (account)? linkgearaccount.getBalance(account) 
                               : 0;
           return res.send({ message: 'Account balance:', result: result });
        });        
        
        registerMethod('t-deductRewards', requireLogged, function (req, res) {
            const {addr, amount} = req.body;
            const result = linkgearaccount.deductRewards(addr, amount);                   
            return res.send({ message: 'Deduct Rewards', result: result });
        });
        
        registerMethod('t-userReward', requireLogged, function (req, res) {
            const { user, password, addr, amount } = req.body;
            const result = linkgearaccount.userReward(user, password, addr, amount);
            return res.send({ message: 'User Rewards', result: result });
        });
        
        registerMethod('t-setExchangeRate', requireLogged, function (req, res) {
            const { rate } = req.body;
            const result = linkgearaccount.setExchangeRate(rate);
            return res.send({ message: 'Set Exchange Rate', result: result });
        });
        
        registerMethod('t-getExchangeRate', requireLogged, function (req, res) {
            const result = linkgearaccount.getExchangeRate();
            return res.send({ message: 'Get Exchange Rate', result: result });
        });
        
        registerMethod('t-linkgearToToken', requireLogged, function (req, res) {
            const {addr, key, amount} = req.body;
            const result = linkgearaccount.linkgearToToken(addr, key, amount);
            return res.send({ message: 'Linkgear to Token', result: result });
        });
        
        registerMethod('t-redeemToken', requireLogged, function (req, res) {
            const {addr, amount} = req.body;
            const result = linkgearaccount.redeemToken(addr, amount);
            return res.send({ message: 'Redeem Token', result: result });
        });

        registerMethod('t-withdraw', requireLogged, function (req, res) {
            const {addr, key} = req.body;
            const result = linkgearaccount.withdraw(addr, key);
            return res.send({ message: 'Withdraw', result: result });
        });
        
        // Link the account
        //
        registerMethod('link-account', requireLogged, function (req, res) {
            const { account } = req.body;
            
            if (!typeof account === 'string')
                throw new Error('Invalid type for account.');

            if (!linkgearaccount.isAddress(account))
                throw new Error(`Invalid linkgear account ${account}.`);
           
            return getUserById(req.user._id).then(user=> {
                updateUser(user._id, {
                    account: account
                }).then(() => {
                    if (onLinkAccount) {
                        onLinkAccount({
                            _id: user._id,
                            email: user[name] && user[name].email,
                            account: account
                        });
                    }              
                    return res.send({
                        message: 'Account has been linked.'
                    });
                });
            });
        });        

        registerMethod('change-password', requireLogged, function (req, res) {
            const { password, newPassword } = req.body;

            if (!typeof password === 'string') {
                throw new Error('Invalid password.');
            }

            testValue('password', newPassword);

            return getUserById(req.user._id).then(user => {
                if ((password || user[name] && user[name].password) && !compareSync(password, user[name].password)) {
                    throw new Error('Incorrect password.');
                }

                updateUser(user._id, {
                    passwordResetToken: null,
                    password: hash(newPassword)
                }).then(() => {
                    if (onChangePassword) {
                        onChangePassword({
                            _id: user._id,
                            email: user[name] && user[name].email
                        });
                    }
                    return res.send({
                        message: 'Password has been changed.'
                    });
                });
            });
        });
    };
};
