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

const linkgearPOS = require('./linkgearPOS.js')
linkgearPOS.web3init();

function testValue(key, value) {
    const test = tests[key];
    if (test.regex) {
        if (!test.regex.test(value)) {
            //console.log(`Error: ${test.error}`);
            throw new Error(test.error);
        }
    } else {
        if (!test.test(value)) {
            //console.log(`Error: ${test.error}`);
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
        registerProfileField('snode');
        registerProfileField('createdAt');
        registerProfileField('userStartTime');
        registerProfileField('dname');

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
            //console.log('Registration');
            const { email, password, account, snode, dname } = req.body;

            //console.log('Registration - check email');
            if (typeof email !== 'string') {
                throw new Error('Invalid email');
            }
            
            if (typeof password !== 'string') {
                throw new Error('Invalid password');
            }
            
            testValue('password', password);
            //console.log(`Registration - check password end`);

            //console.log('Registration - check account begin');
            // Validate the account if an account is passed
            if (account && !linkgearPOS.isAddress(account))
                throw new Error(`Invalid gegeChain Account ${account}`);
            //console.log('Registration - check account end');

            return getUserByUniqueField('email', email).then(user => {
                if (user) {
                    throw new Error('This email is already registered.');
                }
                 
                // LinkgearPOSa Account
                console.log(`LinkgearPOS account: ${account}`);
                 var linkgearPOSAccount = "";
                if (account) { 
                   linkgearPOSAccount = account;
                }
                else {  
                   linkgearPOSAccount = linkgearPOS.createAccount(password);
                   linkgearPOS.sendRewards(linkgearPOSAccount, 100,
                                           snode, Date.now());
                } 
                console.log(`LinkgearPOS account: ${linkgearPOSAccount}`);
           
                const verificationToken = randomToken();
                const hashedPassword = hash(password);
                insertUser({
                    email,
                    password: hashedPassword,
                    account: linkgearPOSAccount,
                    snode: snode,
                    dname: dname,
                    createdAt: new Date(),
                    userStartTime: Date.now(),
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

            const {user} = req.body;

            if (!user[name] || !user[name].email) {
                throw new Error('No email to verify');
            }

            return updateUser(user._id, {
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
        
        // Balance of the account
        // balanceOf(addr)
        registerMethod('t-balanceOf', requireLogged, function (req, res) {
            const {account} = req.body
            const result = linkgearPOS.balanceOf(account); 
            return res.send({ message: `Get Balance of ${account}`, result: result });
        });
                
        // Send rewards to user(publisher)
        // sendRewards(userAddress,token,superNodeAddress,userStartTime)
        registerMethod('t-sendRewards', requireLogged, function (req, res) {
            const {userId, token} = req.body;
 
            return getUserById(userId).then(user=> {
                 const {result, message} = linkgearPOS.sendRewards(
                                         user.local.account, 
                                         token,
                                         user.local.snode, 
                                         user.local.userStartTime);
                  return res.send({
                        message: message, result: result
                    });
            });
        });

        // deduct rewards from user(publisher)
        // deductRewards(userAddress,token,superNodeAddress,userStartTime) 
        registerMethod('t-deductRewards', requireLogged, function (req, res) {
            const {userId, token} = req.body;
 
            return getUserById(userId).then(user=> {
                 const result = linkgearPOS.deductRewards(user.local.account, 
                                         token,
                                         user.local.snode, 
                                         user.local.userStartTime);
                  return res.send({
                        message: 'Deduct rewards from current user', result: result
                    });
            });
        });

        // user send token to other user
        // userSendToken(userAddress,toAddress,token,sNodeAddress,userStartTime)
        registerMethod('t-userSendToken', requireLogged, function (req, res) {
            const {userId, toAddress, token} = req.body;
 
            return getUserById(userId).then(user=> {
                 const result = linkgearPOS.userSendToken(user.local.account, 
                                         toAddress, token,
                                         user.local.snode, 
                                         user.local.userStartTime);
                  return res.send({
                       message: 'Current user sends token to other user', result: result
                    });
            });
        });

        // User join POS
        // joinStake(addr, amount) 
        registerMethod('t-joinStake', requireLogged, function (req, res) {
            const {userId, amount} = req.body;
 
            return getUserById(userId).then(user=> {
               const result = linkgearPOS.joinStake(user.local.account,amount); 
                  return res.send({
                        message: 'Current user joins POS', result: result
                    });
            });
        });

        // user add more amount to POS
        //  addStake(addr, amount)
        registerMethod('t-addStake', requireLogged, function (req, res) {
            const {userId, amount} = req.body;
 
            return getUserById(userId).then(user=> {
                const result = linkgearPOS.addStake(user.local.account,amount); 
                  return res.send({
                        message: 'Current user adds more to POS', result: result
                    });
            });
        });

        // user withdraw amount from POS - but remaining amount cannot below 
        // minmum stake amount
        //  withdrawStake(addr, amount)
        registerMethod('t-withdrawStake', requireLogged, function (req, res) {
            const {userId, amount} = req.body;
 
            return getUserById(userId).then(user=> {
                 const result = linkgearPOS.withdrawStake(user.local.account, 
                                         amount);
                  return res.send({
                       message: 'Current user withdraws amount from POS', result: result
                    });
            });
        });

        // remove user from POS. The holdered stake amount will add back to 
        // user's balance
        // removeStake(addr)
        registerMethod('t-removeStake', requireLogged, function (req, res) {
            const {userId} = reg.body;

            return getUserById(userId).then(user=> {
                 const result = linkgearPOS.removeStake(user.local.account); 
                  return res.send({
                        message: 'Remove current user from POS', result: result
                    });
            });
        });

        // Link the account
        //
        registerMethod('link-account', requireLogged, function (req, res) {
            const { userId, account } = req.body;
            
            if (!typeof account === 'string')
                throw new Error('Invalid type for account.');

            if (!linkgearPOS.isAddress(account))
                throw new Error(`Invalid linkgear account ${account}.`);
           
            return getUserById(userId).then(user=> {
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
            const { userId, password, newPassword } = req.body;

            if (!typeof password === 'string') {
                throw new Error('Invalid password.');
            }

            testValue('password', newPassword);

            return getUserById(userId).then(user => {
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
