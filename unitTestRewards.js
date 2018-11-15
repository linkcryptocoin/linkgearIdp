// Purpose: unit test the token rewards
// Author : Simon Li
// Date   : Oct 14, 2018
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const gege = require('./linkgearPOS.js');

var prearg = "";
var username = "";
process.argv.forEach(function (val, index, array) {
   //console.log(`prearg = ${prearg}, val = ${val}`);
   if (/^(-{1,2}username)$/.test(prearg) && val) 
      username = val.toLowerCase();
   prearg = val;
});

MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   const dbo = db.db("linkgear");
   gege.setMongoDbo(dbo); 

   const query = {"local.username": username};
   dbo.collection("users").findOne(query, function(err, user) {
       if (err) throw err;
   
       if (!user) throw "no user found";

       runTest(user.local.account);
           
       db.close();
   });
});

function assertEQ(p1, p2) {
   if (p1 !== p2)
      throw `failure: ${p1} !== ${p2}`;
}
 
function balanceOf(account) {
   const nSeconds = 10 * 1000; // miliseconds
   setTimeout(function() { 
          console.log(`Balance is: ${gege.balnaceOf(account)}`); 
   }, nSeconds);
}

function testChainPage(uAddr) {
   var balance = balanceOf(uAddr);
   var balanceNew = 0;

   // ChainPage 
   // Test comment - +5
   result = gege.userAction(uAddr, , , 'chainpage', 'comment');
   balanceNew = balanceOf(uAddr);
   assetEQ(balanceNew, balance+5); 
  
   // like - +5
   balance =  balanceNew;
   result = gege.userAction(uAddr, , , 'chainpage', 'like');
   balanceNew = balanceOf(uAddr);
   assetEQ(balanceNew, balance+5); 

   // dislike - +10
   balance =  balanceNew;
   result = gege.userAction(uAddr, , , 'chainpage', 'dislike');
   balanceNew = balanceOf(uAddr);
   assetEQ(balanceNew, balance+10); 
}

function runChainPost(uAddr) {
   var balance = balanceOf(uAddr);
   var balanceNew = 0;
   
   // ChainPost 
   // Test login - +10/1
   for (int idx = 0; idx < 2; idx++ { 
       result = gege.userAction(uAddr, , , 'chainpost', 'login');
   }

   // Test post - +20/5
   for (int idx = 0; idx < 5; idx++ { 
       result = gege.userAction(uAddr, , , 'chainpost', 'post');
   }

   // Test comment - +20/5
   for (int idx = 0; idx < 5; idx++ { 
       result = gege.userAction(uAddr, , , 'chainpost', 'comment');
   }
   
   // Test like - +5/10
   for (int idx = 0; idx < 11; idx++ { 
       result = gege.userAction(uAddr, , , 'chainpost', 'like');
   }
   
   // Test dislike - +5/10
   for (int idx = 0; idx < 11; idx++ { 
       result = gege.userAction(uAddr, , , 'chainpost', 'dislike');
   }
   
   // Test referral - +10/...
   for (int idx = 0; idx < 11; idx++ { 
       result = gege.userAction(uAddr, , , 'chainpost', 'referral');
   }
}

function runTest(uAddr) {
   var balance = balanceOf(uAddr);
   
   // Test registration - +100 
   var result = gege.userAction(uAddr, , , 'register');
   var balanceNew = balanceOf(uAddr);
   assetEQ(balanceNew, balance + 100);

   testChainPage(uAddr);
   
   testChainPost(uAddr);
}
