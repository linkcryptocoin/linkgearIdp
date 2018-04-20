// Name   : linkgeardb.js
// Author : Simon Li
// Purpose: Linkgear Database operation

// start the server service/daemon
// Mac: brew services start mongod
// Ubuntu: sudo service mongod start

// Usage const linkgear = require('./linkgeardb.js');
// admin.startRPC("172.31.83.105", 8088, "*", "web3,personal,admin,debug,db,net,eth,miner,rpc,txpool")

const Web3 = require('web3');
//const web3url = "http://127.0.0.1:8088";
const web3url = "http://172.31.83.105:8088";
//const web3url = "https://www.linkcryptocoin.com/ligear/";
//const web3 = new Web3(Web3.givenProvider || web3url);
var web3 = new Web3(typeof web3 !== 'undefined'? web3.currentProvider : 
                               new Web3.providers.HttpProvider(web3url));
//if (typeof web3 !== 'undefined')
//   web3 = new Web3(web3.currentProvider)
//else
//   web3 = new Web3(new Web3.providers.httpProvider(web3url))

console.log(`web3 version: ${web3.version.api}`);

const LINKGEAR_NETWORK = '0xbda';   // =3034

//  an instance for the mongo client
const MongoClient = require('mongodb').MongoClient;

const MONGO_HOST = 'mongodb://172.31.83.105:32786';
const MONGO_DB = 'linkgear';

const mnid = require('mnid');

module.exports.web3init = function() { }

String.prototype.toHex = function() {
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

String.prototype.hex2asc = function() {
   //var hex = this.toString();//force conversion
    var hex = typeof this === "string"? this : this.toString();
    if (hex.substr(0, 2) === '0x') 
       hex = hex.substr(2);

    console.log(`value = ${hex}`);
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

var getAccessKey = function(email) {
   const arrEmail = email.toLowerCase().split('@');
   const part1 = arrEmail[0][0].toUpperCase() + arrEmail[0].substr(1);
   const part2 = arrEmail[1][0].toLowerCase() + arrEmail[1].substr(1).toUpperCase();
   
   const address = `ge@r${part2}Link${part1}3034`;
   
   return address.toHex();
}

function getLinkgearKey(accessKey) {
   return accessKey.hex2asc();
}

function storeAccount(email, address) {
   // New account
   function account(email, address) {
      this.email   = email;
      var mydata = {
                       network: LINKGEAR_NETWORK,   
                       address: address
                   };
      this.address = mnid.encode(mydata); 
   };
  
   MongoClient.connect(MONGO_HOST, function(err, db) {
       if (err) throw err;
       
       const dbo = db.db(MONGO_DB);
  
       // Insert an account
       dbo.collection("accounts").insertOne(new account(email, address), function(err, res) {
           if (err) throw err;  // failed to insert the array

           console.log(`The account for ${email} was saved`); 
           // res is an object returned 
       });
       db.close();
   });
}

module.exports.decodeLikgearAccount = function(dAccount) {
   const myaccount = mnid.decode(dAccount);

   return myaccount.network === LINKGEAR_NETWORK? myaccount.address : null
}

var createLinkgearAccount = function(email) {
  var privateKey = email.toLowerCase(); 
  //console.log("Access key: " + privateKey);
  
  // --rpc --rpcapi db,eth,net,web3,personal,web3
  //var newAccount = web3.personal.newAccount(privateKey);
  //web3.personal.newAccount(privateKey).then(successCallback);
  var account = web3.personal.newAccount(privateKey);
  storeAccount(email, account);  // store
  console.log(`Account ${account} was created and stored`);

  return account;   
}


module.exports.getAccessKey = getAccessKey
module.exports.createLinkgearAccount = createLinkgearAccount

