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

console.log(`web3.version: ${web3.version.api}`);

module.exports.web3init = function() { }

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

module.exports.change = function(oldAccount, oldPrivateKey, newPrivateKey) {
   const newAccount = create(newPrivateKey); // Create a new account

   // Transfer the balance from the old account to the new account
   transfer(oldAccount, oldPrivateKey, newAccount);
   return newAccount;
}

function create(privateKey) {
  // --rpc --rpcapi db,eth,net,web3,personal,web3
  //var newAccount = web3.personal.newAccount(privateKey);
  //web3.personal.newAccount(privateKey).then(successCallback);
  var account = web3.personal.newAccount(privateKey);
  console.log(`Account ${account} was created`);

  return account;   
}

function transfer(oldAccount, privateKey, newAccount) {
   web3.personal.unlockAccount(oldAccount, privateKey);
   web3.sendTransaction({from: oldAccount, 
                         to: newAccount,
                         value: web3.toWei(web3.eth.getBalance(oldAccount))
                        })
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

