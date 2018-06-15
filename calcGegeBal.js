// Purpose: calculate the balance for each account
//          store the balance sheet
// Author :  Simon Li
// Date   : June 16, 2018
// Linkgear Foundation, All rights reserved
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const linkgearPOS = require('./linkgearPOS.js');
const gegeweb3 = linkgearPOS.gegeweb3();
   
MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   const dbo = db.db("linkgear");

   const query = {"local.account": {$ne: ""}};
   dbo.collection("users").find(query, {"local.account":1}).toArray(function(err, users) {
       if (err) throw err;
       
       users.forEach(function(user) {
           const account = user.local.account;
	   if (account !== "undefined" && gegeweb3.isAddress(account)) { 
              const bal = parseInt(linkgearPOS.balanceOf(account));
              console.log(`${account}, ${bal}`);
              /*
              dbo.collection("BalanceSheet").findAndModify({
                query: { account: account }, 
                update: { token: bal },
                upsert: true,
                new: true
             }, function(err, res) {
                 if (err) throw err;
                 console.log(`${JSON.stringify(res)}`);
             });
             */ 
           }
       });      
       db.close();
   });
});

