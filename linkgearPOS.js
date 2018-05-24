// linkgearPOS -- gegeChain operation 
// Author: Simon Li
// Date: May 17, 2018
// LinkGear Fundation, all  rights reserved
"use strict";

const P1CK = true;
const fs = require('fs');
const Web3 = require('web3');
//const web3url = "http://127.0.0.1:8501";
const web3url = (P1CK)? "http://172.31.83.105:8501" : 
                        "http://172.31.39.175:8506"; 
var gegeweb3 = new Web3(typeof gegeweb3 !== 'undefined'? gegeweb3.currentProvider : 
                               new Web3.providers.HttpProvider(web3url));

const defaultGas = 8000000;
const defaultSNode = '0x0';

const takenLimitation = {
                           oneTime: 400,
                           daily:   15000,
                        }

// Check the connectivity
if (gegeweb3.isConnected()) 
   console.log(`web3.version used by gegeChain: ${gegeweb3.version.api}`);

module.exports.web3init = function(rpcUrl) { 
   if (rpcUrl) {
       gegeweb3 = new Web3.providers.HttpProvider(rpcUrl);
       if (gegeweb3.isConnected()) 
           console.log(`web3 gegeChain connected: ${gegeweb3.version.api}`);
   }
}

module.exports.gegeweb3 = function() { return gegeweb3;}

// We need a mongodb Client to do some db stuff
var dbo = null;
module.exports.setMongoDbo = function(db) { 
   if (!dbo) dbo = db;
}

// Tracking the transactions
function trackingTran(doc) {
   if (!dbo) return false;
  
   doc.timestamp = new Date();
   // Trancking down the change to collection translog
   dbo.collection("translog").insertOne(doc, function(err, res) {
       if (err) throw err;
       return true;
   });
}

// To get ABI use command: solcjs LinkgearPoSToken.sol --abi
// Get Address from migrate
const contractABI = [{"constant":false,"inputs":[{"name":"_superNode","type":"address"},{"name":"_value","type":"uint256"},{"name":"_userStartTime","type":"uint256"}],"name":"addTransactionRewards","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"getStakeInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_rewardList","type":"address[]"},{"name":"_toBlock","type":"uint256"}],"name":"sendStakeBlockRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"promotionPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_transactionRewardsRate","type":"uint256"}],"name":"setTransactionRewardsRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_promotionRate","type":"uint256"}],"name":"setpromotionRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"promotionRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTransactionRewardsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOfWithdrawal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_blockNumber","type":"uint256"}],"name":"setLastRewardBlockNumber","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"linkgearToToken","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"timestamp","type":"uint256"}],"name":"ownerSetStakeStartTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxTotalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastRewardBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_superNode","type":"address"},{"name":"_userStartTime","type":"uint256"}],"name":"sendRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_superNode","type":"address"},{"name":"_userStartTime","type":"uint256"}],"name":"userSendToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"stakeOf","outputs":[{"name":"_stake","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMinStakeAmount","outputs":[{"name":"mStakeAmountr","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"chainStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"}],"name":"addStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stakeStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionRewardsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_token","type":"uint256"}],"name":"redeemToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipients","type":"address[]"},{"name":"_values","type":"uint256[]"}],"name":"batchTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"ownerBurnToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getpromotionRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_superNode","type":"address"},{"name":"_userStartTime","type":"uint256"}],"name":"deductRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMaxStakeHolder","outputs":[{"name":"mStakeHolder","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBlockRewards","outputs":[{"name":"bReward","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalInitialSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPromotionPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"setTokenName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getLastRewardBlockNumber","outputs":[{"name":"blockNumber","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxStakeHolder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_promotionPeriod","type":"uint256"}],"name":"setPromotionPeriod","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_symbol","type":"string"}],"name":"setTokenSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdrawStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"chainStartBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_blockReward","type":"uint256"}],"name":"setBlockRewards","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"blockRewards","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_exchangeRate","type":"uint256"}],"name":"setExchangeRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"stakeHolderList","outputs":[{"name":"nodeAddress","type":"address"},{"name":"stakeHolderBalance","type":"uint256"},{"name":"transactionRewards","type":"uint256"},{"name":"missBlockRewardsCount","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getExchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_minStakeAmount","type":"uint256"}],"name":"setMinStakeAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_maxStakeHolder","type":"uint256"}],"name":"setMaxStakeHolder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"sendStakeTransactionRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenSymbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minStakeAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"}],"name":"joinStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"removeStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getStakeNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"JoinStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"AddStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"RemoveStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"WithdrawStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"SendStakeBlockRewards","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"SendStakeTransactionRewards","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"miner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
const contractAddress = (P1CK)? "0x14ec9920ed3e2352d8ce2d91a7ff0202d3cc57f0" :
                                "0x36f5ed4e47abba4a28058c9debfaf3410a54b406";

//console.log(`contract:${contractABI}`);

// Set the efault accounta
//console.log("Begin Test1");
//console.log(`coinbase: ${gegeweb3.eth.coinbase}`);
//console.log("End Test1");

gegeweb3.eth.defaultAccount = gegeweb3.eth.coinbase;
gegeweb3.personal.unlockAccount(gegeweb3.eth.coinbase, getCoinbaseKey('userKey'));
//console.log(`defaultAccount: ${gegeweb3.eth.defaultAccount}`);
//console.log(`Key: "${getCoinbaseKey('userKey')}"`);

const gegePOS = gegeweb3.eth.contract(contractABI).at(contractAddress);
//console.log(`gegePOS = ${gegePOS}`)

// Create an account
module.exports.createAccount = function(privateKey) {
    const account = gegeweb3.personal.newAccount(privateKey);
    trackingTran({account: account, message: "Account was created"});
    return account;   
}

// Get the private key
function getCoinbaseKey(fake) {
   const file = '.dummyKey';
   const [keyInput, start, end, dummy] = fs.readFileSync(file).toString().split('@@');
   return keyInput.slice(parseInt(start), parseInt(end));
}

function getMonday(iDay) {
    const d = (iDay)? new Date(iDay) : new Date();

    const day = d.getDay();
    const diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function getSunday(iDay) {
    const d = (iDay)? new Date(iDay) : new Date();
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function formatISODate(date) {
    const d = (date)? new Date(date) : new Date();
    var   month = '' + (d.getMonth() + 1);
    var   day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-') + "T00:00:00.000Z";
}

module.exports.sendRewards = function(uAddr, token, sAddr, uStart) {
   const nToken = (typeof token === "string")? parseInt(token) : token;
   
   // transfer rewards
   if (!sAddr || !isAddress(sAddr)) sAddr = defaultSNode;
   // convert the milliseconds to the seconds
   if (!uStart) uStart = Date.now();
   const timeStamp = Math.floor(uStart / 1000);
   
   // Check the taken limitation
   if (nToken <= 0) // check the amount
       return {result: false, message: "The token is less or equal to zero"}

   // Check the oneTime limitation
   if (nToken > takenLimitation.oneTime)
       return {result: false, message: `Over one time limitation ${takenLimitation.oneTime}`}

   // Check the daily limitation
   const dateBegin = new Date(formatISODate());  // The beginning of Today
   const dateEnd = new Date();                   // The current time of Today
   dbo.collection("translog").aggregate([{$match: {$and: [{tcode: "sendRewards"},{uAddr: uAddr}, {timestamp:{$gte: dateBegin}},{timestamp:{$lt: dateEnd}}]}}, {$group: { _id:null, total: {$sum: "$token"}}}]).toArray(function(err, result) {
    if (err) throw err;
 
    const overLimit = (result.length > 0 && result[0].total + nToken > takenLimitation.daily)

    if (!overLimit) {
        // transfer rewards
        trackingTran({tcode:"sendRewards", uAddr:uAddr, token:nToken, sAddr: sAddr, startTime: timeStamp});
        const result = gegePOS.sendRewards.sendTransaction(uAddr,token,sAddr,timeStamp,
                                  {from:gegeweb3.eth.coinbase, gas:defaultGas}) 
        return {result: true, message: `Send rewards to current user ${token}`};
    }
    else
        return {result: false, message: "Over daily limitation"};
    
   });    
   
   return {result: true, message: `Send rewards to current user ${token}`};
}

// This function shows how to deduct rewards from user(publisher)
module.exports.deductRewards = function(uAddr,token,sAddr,uStart) {
    const nToken = (typeof token === "string")? parseInt(token) : token;
    if (nToken <= 0) return false;

    if (!sAddr || !isAddress(sAddr)) sAddr = defaultSNode;
    // convert the milliseconds to the seconds
    if (!uStart) uStart = Date.now();
    const timeStamp = Math.floor(uStart / 1000);
 
  trackingTran({tcode:"deductewards", uAddr:uAddr, token:nToken, sAddr: sAddr, startTime: timeStamp});
    return gegePOS.deductRewards(uAddr, token, sAddr, timeStamp)  
}

// This function shows how a user can send rewards publisher
module.exports.userSendToken = function(uAddr,toAddr,token,sAddr,uStart) {
    const nToken = (typeof token === "string")? parseInt(token) : token;
    if (nToken <= 0) return false;

    if (!sAddr || !isAddress(sAddr)) sAddr = defaultSNode;
    // convert the milliseconds to the seconds
    if (!uStart) uStart = Date.now();
    const timeStamp = Math.floor(uStart / 1000);

   trackingTran({tcode:"userSendToken", uAddr:uAddr, toAddr:toAddr, token:nToken, sAddr: sAddr, startTime: timeStamp});
    return gegePOS.userSendToken(uAddr,toAddr,token,sAddr,timeStamp)
}

// Balance of the account in the gege Chain
module.exports.balanceOf = function(acct) {
    return gegePOS.balanceOf(acct) 
}

// Check the balances for all the accounts
module.exports.checkAllBalances = function() {
  var idx = 0;
  gegeweb3.eth.accounts.forEach( function(acct) {  // 1 ether = 1 ligear
      console.log("   Account[" + idx + "]:" +
       acct + " \tbalance: " + gegePOS.balanceOf(acct) + 
       "  token"
      ); 
      idx++; 
  })  
}

// User join POS
module.exports.joinStake = function(addr, amount) {
    trackingTran({tcode: "joinStake", amount: amount});
    return gegePOS.joinStake.sendTransaction(addr,amount,
                    {from: gegeweb3.eth.coinbase, gas: defaultGas})
}

// user add more amount to account
module.exports.addStake = function(addr, amount) {
    trackingTran({tcode: "addStake", amount: amount});
    return gegePOS.addStake.sendTransaction(addr,amount,
                    {from: gegeweb3.eth.coinbase, gas: defaultGas})
}

// user withdraw amount from account - but remain amount cannot below minmum 
// stake amount
module.exports.withdrawStake = function(addr, amount) {
    trackingTran({tcode: "withdrawStake", amount: amount});
    return gegePOS.withdrawStake.sendTransaction(addr,amount,
                    {from: gegeweb3.eth.coinbase, gas: defaultGas})
}

// remove user from stake
module.exports.removeStake = function(addr) {
    trackingTran({tcode: "removeStake"});
    return gegePOS.removeStake.sendTransaction(addr,
                    {from: gegeweb3.eth.coinbase, gas: defaultGas})
}

//send rewards to stake holder
module.exports.sendBlockRewards = function() {
    const startBlock = Number(gegePOS.getLastRewardBlockNumber()) + 1;
    const currentBlock  = gegeweb3.eth.blockNumber;

    const addrList = getMinerList(startBlock, currentBlock)
 
    gegePOS.sendStakeBlockRewards.sendTransaction(addrList, currentBlock,
                       {from: gegeweb3.eth.coinbase, gas: defaultGas})
}

module.exports.sendTransactionRewards = function() {
    return gegePOS.sendStakeTransactionRewards.sendTransaction(
          {from: gegeweb3.eth.coinbase, gas: defaultGas})
}

// Check the mined blocks by the input address/account
function minedBlocks(lastn, addr) {
    var addrs = [];
    if (!addr) {
        addr = gegeweb3.eth.coinbase;
    }

    var limit = gegeweb3.eth.blockNumber - lastn;
    for (var i = gegeweb3.eth.blockNumber; i >= limit; i--) {
        if (gegeweb3.eth.getBlock(i).miner == addr) {
            addrs.push(i);
        }
    }
    return addrs;
}

// Get the miner list for recent blocks
function getMinerList(startBlock, lastBlock) {
    var addrs = [];

    for (var i = startBlock; i <= lastBlock; i++) {
        var strBlock ='0x' +  Number(i).toString(16);
        var recents = clique.getSnapshot(strBlock).recents;
        var aMiner = recents[i];
    
        if (addrs.indexOf(aMiner) < 0) {
            addrs.push(aMiner);
        }
    }
    return addrs;
}

// Get the miners from block 1 to block 2
function getMiners(block1, block2) {
    var addrs = [];
  
    // Node
    function node(miner, count) {
  	this.miner = miner;
        this.nCount = count;
    } 

    if (!block2)  // no block2 provided
        block2 = gegeweb3.eth.blockNumber;

    if (block1 <= 0) // offset the block2 if block is negative
        block1 = block2 + block1;
 
    //console.log("Block range: " + block1 + " to " + block2);
    for (var iblk = block1; iblk <= block2; iblk++) {
  	 var bFound = false;

         for (var idx = 0;idx < addrs.length; idx++) {
     	     if (addrs[idx].miner === eth.getBlock(iblk).miner) {
                 addrs[idx].nCount++;
                 bFound = true;
                 break;
             }
         }
         if (!bFound) { // not in the list yet, add it
            addrs.push(new node(eth.getBlock(iblk).miner, 1));
         }  
    }
    return addrs;
}

module.exports.transferBalance = function() {
    for (var idx=1; idx <= 20; idx++) {
        result = gegePOS.transfer(gegeweb3.eth.accounts[idx],500000);
        console.log(`${idx}: ${result}`)
    }
    checkAllBalances();
}

module.exports.getStakeHolderInfo = function() {
    for (var idx=1; idx < gegePOS.getStakeNumber(); idx++) {
        var result = gegePOS.getStakeInfo(idx);
        console.log(`${idx}: ${result}`)
    }
}

module.exports.groupJoinStake = function() {
    for (var idx=1; idx <= 20; idx++) {
       result = gegePOS.joinStake.sendTransaction(gegeweb3.eth.accounts[idx],100000,
{from: gegeweb3.eth.coinbase, gas: defaultGas});
       console.log(`${idx}: ${result}`)
    }
    getStakeHolderInfo()
}

module.exports.testBlockRewards = function() {
    const startBlock = Number(gegePOS.getLastRewardBlockNumber()) + 1;
    const currentBlock  = gegeweb3.eth.blockNumber;

    console.log(`Last Rewards distribution block: ${startBlock},  Current Block:${currentBlock}`);

    var addrList= [];
    for (var idx = 0;idx < 23; idx++) {
        addrList.push(gegeweb3.eth.accounts[idx]);
    }
 
    console.log(addrList)

    gegePOS.sendStakeBlockRewards.sendTransaction(addrList,currentBlock,
       {from:gegeweb3.eth.coinbase, gas: defaultGas})

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

function isChecksumAddress(address) {
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
