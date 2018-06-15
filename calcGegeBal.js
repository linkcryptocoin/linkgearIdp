// Purpose: calculate the balance for each account
//          store the balance sheet
// Author :  Simon Li
// Date   : June 16, 2018
// Linkgear Foundation, All rights reserved
'use strict';
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const linkgearPOS = require('./linkgearPOS.js');
const gegeweb3 = linkgearPOS.gegeweb3();
const todayStr = new Date().toISOString().substr(0, 10);
const fileName = '.balanceSheet_<Today>.csv'.replace(/<TODAY>/i, todayStr);

const fs = require('fs')
console.log(`the file is: ${fileName}`);

try {
  fs.unlinkSync(fileName);
  console.log(`successfully deleted ${fileName}`);
} catch (err) {
  // handle the error
}

const logger = fs.createWriteStream(fileName, {
  flags: 'a' // 'a' means appending (old data will be preserved)
})
   
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
              //console.log(`${account}, ${bal}`);
              logger.write(`${account},${bal}\n`);
           }
       });      
       db.close();
   });
});

