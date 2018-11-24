// Purpose: unit test the token rewards
// Author : Simon Li
// Date   : Oct 14, 2018
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const gege = require('./linkgearPOS.js');
//const Gege = require('./GegeChain.js');
//const gege = new Gege();
const defaultSNode = '0x0';

var prearg = "";
var username = "";
process.argv.forEach(function (val, index, array) {
   //console.log(`prearg = ${prearg}, val = ${val}`);
   if (/^(-{1,2}username)$/.test(prearg) && val) 
      username = val.toLowerCase();
   prearg = val;
});

MongoClient.connect(url, function(err, db) {
   //console.log('Connected');

   if (err) throw err;
   const dbo = db.db("linkgear");
   if (!dbo)
      console('failed to create a db instance');

   gege.setMongoDbo(dbo); 
   console.log(`user: ${username}`);

   const query = {"local.username": username};
   dbo.collection("users").findOne(query, function(err, user) {
       if (err) throw err;
   
       if (!user) throw "no user found";

       runTest(user.local.account);
           
       db.close();
   });
   //db.close();
});

function assertEQ(p1, p2) {
   if (p1 !== p2)
      throw `failure: ${p1} !== ${p2}`;
}
 
function delay(nSec) {
   const nSeconds = nSec * 1000; // miliseconds
   setTimeout(function() { 
          console.log(`Delay ${nSec} seconds`); 
   }, nSeconds);
}
function balanceOf(account) {
   const nSeconds = 10 * 1000; // miliseconds
   setTimeout(function() { 
          return gege.balanceOf(account); 
   }, nSeconds);
}

function testChainPage(uAddr) {
   var balance = gege.balanceOf(uAddr);
   var balanceNew = 0;

   // ChainPage 
   // Test comment - +5
   result = gege.userAction(uAddr, defaultSNode , null, 'chainpage', 'comment');
   balanceNew = gege.balanceOf(uAddr);
   assertEQ(balanceNew, balance+5); 
  
   // like - +5
   balance =  balanceNew;
   result = gege.userAction(uAddr, '', null, 'chainpage', 'like');
   balanceNew = balanceOf(uAddr);
   assertEQ(balanceNew, balance+5); 

   // dislike - +10
   balance =  balanceNew;
   result = gege.userAction(uAddr,'', null, 'chainpage', 'dislike');
   balanceNew = balanceOf(uAddr);
   assertEQ(balanceNew, balance+10); 
}

function runChainPost(uAddr) {
   var balance = balanceOf(uAddr);
   var balanceNew = 0;
   
   // ChainPost 
   // Test login - +10/1
   for (var idx = 0; idx < 2; idx++) { 
       result = gege.userAction(uAddr, '', null, 'chainpost', 'login');
   }

   // Test post - +20/5
   for (var idx = 0; idx < 5; idx++) { 
       result = gege.userAction(uAddr, '', null, 'chainpost', 'post');
   }

   // Test comment - +20/5
   for (var idx = 0; idx < 5; idx++) { 
       result = gege.userAction(uAddr, '', null, 'chainpost', 'comment');
   }
   
   // Test like - +5/10
   for (var idx = 0; idx < 11; idx++) { 
       result = gege.userAction(uAddr, '', null, 'chainpost', 'like');
   }
   
   // Test dislike - +5/10
   for (var idx = 0; idx < 11; idx++) { 
       result = gege.userAction(uAddr, null, null, 'chainpost', 'dislike');
   }
   
   // Test referral - +10/...
   for (var idx = 0; idx < 11; idx++) { 
       result = gege.userAction(uAddr, null, null, 'chainpost', 'referral');
   }
}

function show(bal) {
   console.log(`The balance is: ${bal}`);
}
function runTest(uAddr) {
   var balance = Number(gege.balanceOf(uAddr));
  
   // Test registration - +100
   console.log('Test "register"'); 
   show(balance);
   var result = gege.userAction(uAddr, defaultSNode, Date.now(), 'register', '');
   delay(100);
   var balanceNew = Number(gege.balanceOf(uAddr));
   balance += 100;
   assertEQ(balanceNew, balance);
   show(balance);
 
   //testChainPage(uAddr);
   
   //testChainPost(uAddr);
}
