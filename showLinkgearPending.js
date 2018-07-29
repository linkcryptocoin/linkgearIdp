"use strict";

const Linkgear = require('./Linkgear.js');
const linkgear = new Linkgear();

var account = "";
var showDetail = false;
 
var prearg = "";
process.argv.forEach(function (val, index, array) {
   prearg = prearg.toLowerCase();
   //console.log(`prearg = ${prearg}`);
   if ((/^(-{1,2}address)$/.test(prearg) || /^(-{1,2}account)$/.test(prearg))
       && !isNaN(val)) {
      account = val;
   }  
   else if (/^(-{1,2}detail)$/.test(val) || /^(-{1,2}showdetail)$/.test(val))
      showDetail = true;
   prearg = val;
})

if (account) 
   console.log(`The pending transactions for account ${account}`);
else
   console.log(`All the pending transactions`);

var idx = 1;
linkgear.pendingTransactions().forEach(function(tx) {
        console.log(`txHash[${idx++}] => ${tx}`);

        if (showDetail) {
            const tran = linkgear.getTransaction(tx);
            console.log(JSON.stringify(tran));
        }
})


