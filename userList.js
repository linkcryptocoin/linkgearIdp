// Purpose: user list 
// Author : Simon Li
// Date   : June 16, 2018
// Linkgear Foundation, All rights reserved
'use strict';
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const Gege = require('./GegeChain.js');
const gege = new Gege();

const fileName = 'users.csv';
const fs = require('fs')

var noFile = false;
process.argv.forEach(function (val, index, array) {
   //console.log(`prearg = ${prearg}, val = ${val}`);
   if (/^(-{1,2}nofile)$/.test(val.toLowerCase())) 
      noFile = true;
});

if (!noFile) {
    console.log(`the file is: ${fileName}`);

    try {
       fs.unlinkSync(fileName);
       console.log(`successfully deleted ${fileName}`);
    } catch (err) {
    // handle the error
    }

}

const logger = fs.createWriteStream(fileName, {
          flags: 'a' // 'a' means appending (old data will be preserved)
})
   
MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   const dbo = db.db("linkgear");

   if (noFile)
       console.log("email,username,dname,super node,created At,last Logged-on,account,token");
   else
       logger.write("email,username,dname,super node,created At,last Logged-on,account,token\n");

   const query = {};
   dbo.collection("users").find(query, {"local.email":1,"local.dname":1,"local.snode":1,"local.createdAt":1,"local.logInTime":1,"local.account":1}).toArray(function(err, users) {
       if (err) throw err;
  
       users.forEach(function(user) {
           const email = user.local.email;
           const username = user.local.username;
           const dname = (user.local.dname)? user.local.dname : "";
           const snode = (user.local.snode)? user.local.snode : "";
           const createdAt = (user.local.createdAt)? user.local.createdAt : "";
           const logInTime = (user.local.logInTime)? new Date(user.local.logInTime) : "";
           const account = user.local.account;
	   var balance = 0;
           if (account !== "undefined" && gege.isAddress(account)) { 
              balance = Number(gege.balanceOf(account));
           }
           if (noFile)
              console.log(`${email},${username},${dname},${snode},${createdAt},${logInTime}, ${account},${balance}`);
           else
              //logger.write(`${account},${bal}\n`);
              logger.write(`${email},${username},${dname},${snode},${createdAt},${logInTime},${account},${balance}\n`);
           
       });      
       db.close();
   });
});

