// Name   : linkgearaccount.js
// Author : Simon Li
// Purpose: Linkgear Account operation

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

