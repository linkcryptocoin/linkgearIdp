// Purpose: reset the balance for each account
//          from the balance sheet
// Author : Simon Li
// Date   : June 16, 2018
// Linkgear Foundation, All rights reserved

'use strict';
const Gege = require('./GegeChain.js');
const gege = new Gege();

const todayStr = new Date().toISOString().substr(0, 10);
var fileName = '.balanceSheet_<Today>.csv'.replace(/<TODAY>/i, todayStr);

var prearg = "";
process.argv.forEach(function (val, index, array) {
   //console.log(`prearg = ${prearg}, val = ${val}`);
   if (/^(-{1,2}file)$/.test(prearg) && typeof val !== "undefined") 
      fileName = val.replace(/<TODAY>/i, todayStr);
  
    prearg = val.toLowerCase();
})
console.log(`file name is ${fileName}`);

const fs = require('fs');
const array = fs.readFileSync(fileName).toString().split('\n');

var updedCount = 0;
var noUpdCount = 0;
array.forEach(function(line) {
   const [account, balFromCsv] = line.split(",");
   const token = parseInt(balFromCsv);
   const newBal = (token < 100)? 100 : token;
   const oldBal = Number(gege.balanceOf(account));
  
   if (gege.isAddress(account)) {
       if (oldBal === newBal) {
          noUpdCount++;
          console.log(`${account}: ${oldBal} = ${newBal}, no change needed`);
       }
       else {
          updedCount++;
          console.log(`${account}: ${oldBal} => ${newBal}, update balance `);
          const result = gege.directlySendRewards(account, newBal);
          //console.log(`result: ${result}`);
       }       
   }
});

console.log(`Total updated: ${updedCount}, staying same: ${noUpdCount}`);

