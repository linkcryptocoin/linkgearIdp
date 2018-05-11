// Name   : linkgearaccount.js
// Author : Simon Li
// Purpose: Linkgear Account operation

'use strict';

const Web3 = require('web3');
//const web3url = "http://127.0.0.1:8088";
const web3url = "http://172.31.83.105:8088";
//const web3url = "https://www.linkcryptocoin.com/ligear/";
var web3 = new Web3(typeof web3 !== 'undefined'? web3.currentProvider : 
                               new Web3.providers.HttpProvider(web3url));

const LINKGEAR_NETWORK = '0xbda';   // =3034

const mnid = require('mnid');
const fs = require('fs');
var dbo = null;

console.log(`web3.version: ${web3.version.api}`);

module.exports.web3init = function() { }

module.exports.web3 = function() { return web3; }
module.exports.getWeb3 = function() { return web3; }

// We need a mongodb Client to do some db stuff
module.exports.setMongoDbo = function(db) { 
   if (!dbo) dbo = db;
   //trackingAcct('test1', 10, '+');
   //trackingAccts([{account: 'test1', amount: 20, sign: '-'},
   //               {account: 'test2', amount: 20, sign: '+'}]);
}

// Get linkgear account 
module.exports.get = function(privateKey, needEncode) {
   const account = create(privateKey)

   if (needEncode == undefined)
      return account;
   else
      return mnid.encode({ network: LINKGEAR_NETWORK, 
                           address: account
                        });
}

// encode a linkgear account to a mnid account
module.exports.encode = function(account) {
   return mnid.encode({ network: LINKGEAR_NETWORK, 
                        address: account
                      });
}

// decode a mnid account to a linkgear account
module.exports.decode = function(dAccount) {
   const myaccount = mnid.decode(dAccount);

   return myaccount.network === LINKGEAR_NETWORK? myaccount.address : null
}

// Change the private key
module.exports.change = function(oldAccount, oldPrivateKey, newPrivateKey) {
   const newAccount = create(newPrivateKey); // Create a new account

   // Transfer the balance from the old account to the new account
   transfer(oldAccount, oldPrivateKey, newAccount);
   // oldAccount will be a garbage, will find a way to collect it
   return newAccount;
}

//The balance for a linkgear account
module.exports.getBalance = function(account) {
   if (!account) return 0.00;

   const weiValue = web3.eth.getBalance(account);
   //return Math.round(parseFloat(web3.fromWei(weiValue))) * 100 /100;
   return web3.fromWei(weiValue);
   // ether = ligear
}

// Create an account
function create(privateKey) {
  // --rpc --rpcapi db,eth,net,web3,personal,web3
  //var newAccount = web3.personal.newAccount(privateKey);
  //web3.personal.newAccount(privateKey).then(successCallback);
  const account = web3.personal.newAccount(privateKey);
  console.log(`Account ${account} was created`);

  return account;   
}

// Transfer the balance from the old account to the new account
function transfer(oldAccount, privateKey, newAccount) {
   web3.personal.unlockAccount(oldAccount, privateKey);
   web3.sendTransaction({from: oldAccount, 
                         to: newAccount,
                         value: web3.toWei(web3.eth.getBalance(oldAccount))
                        })
}

// Get the private key
function getCoinbaseKey(fake) {
   const file = '.dummyKey';
   const [keyInput, start, end] = fs.readFileSync(file).toString().split('@');
   return keyInput.slice(parseInt(start), parseInt(end));
}

//
// Ethereum address checking
// https://github.com/cilphex/ethereum-address/blob/master/index.js
//

let SHA3 = require('crypto-js/sha3');

let sha3 = (value) => {
  return SHA3(value, {
    outputLength: 256
  }).toString();
}

let isAddress = (address) => {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // Check if it has the basic requirements of an address
        return false;
    }
    else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    }
    else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

let isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    let addressHash = sha3(address.toLowerCase());

    for (let i = 0; i < 40; i++ ) {
        // The nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
            (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};

module.exports.isAddress = isAddress;
module.exports.isChecksumAddress = isChecksumAddress;

//
// Linkgear Contract Token - originally from Jun Mao
//

function trackingAcct(account, amount, sign) {
   if (!dbo) return false;
  
   // Trancking down the change to collection translog
   const myobj = { account: account, amount: amount, sign: sign };

   dbo.collection("translog").insertOne(myobj, function(err, res) {
       if (err) throw err;
       return true;
   });
}

function trackingAccts(arrAccounts) {
   if (!dbo) return false;

   // Trancking down the change to collection translog
   dbo.collection("translog").insertMany(arrAccounts, function(err, res) {
       if (err) throw err;
       return true;
   });
}

// To get ABI use command: solcjs LinkgearPoSToken.sol --abi
// Get Address from migrate
const contractABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOfWithdrawal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"linkgearToToken","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"maxTotalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"chainStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_token","type":"uint256"}],"name":"redeemToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipients","type":"address[]"},{"name":"_values","type":"uint256[]"}],"name":"batchTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"ownerBurnToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalInitialSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"setTokenName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_symbol","type":"string"}],"name":"setTokenSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"chainStartBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_exchangeRate","type":"uint256"}],"name":"setExchangeRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getExchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTokenSymbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
const contractAddress = "0x799d35A574c0142E5e1DB141FEF4645515237580";

// Set the efault accounta
web3.eth.defaultAccount = web3.eth.coinbase;
web3.personal.unlockAccount(web3.eth.defaultAccount, getCoinbaseKey('userKey'));

const linkgearToken = web3.eth.contract(contractABI).at(contractAddress);
//console.log('linkgearToken:' + JSON.stringify(linkgearToken));

const breakInKey = 'Please change this during running time';

const defaultGasConsumed = 8000000;

// This function shows how to send rewards to user(publisher)
// Transfer the amount from the owner account to the account
module.exports.sendRewards = function(toAccount, amount) {
   if (!amount || amount <= 0) return false;
  
   const ownerAccount = linkgearToken.owner();
   // transfer rewards
   trackingAccts([{account: toAccount,    amount: amount, sign: '+'},
                  {account: ownerAccount, amount: amount, sign: '-'}]);

   return linkgearToken.transfer(toAccount, amount); // the result will be the transaction hash
}

// This function shows how to deduct rewards from user(publisher)
// Transfer the amount from the account to the owner account
module.exports.deductRewards = function(fromAccount, amount) {
   if (!amount || amount <= 0) return false;

   // Owner account
   const ownerAccount = linkgearToken.owner();
   //console.log(`TransferFrom\('${fromAccount}', '${ownerAccount}', ${amount}\)`);
   trackingAccts([{account: fromAccount,  amount: amount, sign: '-'},
                  {account: ownerAccount, amount: amount, sign: '+'}]);

   return linkgearToken.transferFrom(fromAccount, ownerAccount, amount); // the result will be the transaction hash
}

// This function shows how a user can send rewards publishe
// Transfer the amount from one account to another
module.exports.userReward = function(frmAccount, privateKey,toAccount, amount) {
   if (!amount || amount <= 0) return false;
   if (!fromAccount || frmAccount === web3.eth.coinbase) return false;

   web3.personal.unlockAccount(fromAccount, privateKey);
   //console.log(`linkgearToken.transferFrom(${fromAccount}, ${toAccount}, ${amount}`); 
   trackingAccts([{account: frmAccount, amount: amount, sign: '-'},
                  {account: toAccount,  amount: amount, sign: '+'}]);
   return linkgearToken.transferFrom(fromAccount, toAccount, amount) // the result will be the transaction hash
}

// Get the token balance
module.exports.getTokenBalance = function(account) {
   if (!account) return 0.00;
   return linkgearToken.balanceOf(account); 
}

// Set Exchange Rate
module.exports.setExchangeRate = function(rate) {
   linkgearToken.setExchangeRate(rate);
}

// Get Exchange Rate
module.exports.getExchangeRate = function() {
   return linkgearToken.getExchangeRate();
}

// Exchange Linkgear to Token -- account "++"
module.exports.linkgearToToken = function(account, privateKey, amount) {
   web3.personal.unlockAccount(account, privateKey);
   const weiValue = web3.toWei(amount, "ether");  // ether = ligear
   
   trackingAcct(account, amount, '++');
   return linkgearToken.sendTransaction({from: account,value: weiValue, gas: defaultGasConsumed});
}

// redeem token - account "--"
module.exports.redeemToken = function(account, token) {
   if (!token || token <= 0) return false;

   trackingAcct(account, token, '--');
   return linkgearToken.redeemToken(account, token);
}

// Withdraw a fee/gas - account "---"
module.exports.withdraw = function(account, privateKey) {
   const estimateGas = linkgearToken.withdraw.estimateGas(); 
   const eGas = (estimateGas > 0)? estimateGas : defaultGasConsumed;
  
   web3.personal.unlockAccount(account, privateKey);
   trackingAcct(account, eGas, '---');
   return linkgearToken.sendTransaction({from:account, gas: eGas});
}  


