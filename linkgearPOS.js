// linkgearPOS -- gegeChain operation 
// Date: May 17, 2018

"use strict";

const Web3 = require('web3');
//const web3url = "http://127.0.0.1:8501";
const web3url = "http://172.31.83.105:8501";
var gegeweb3 = new Web3(typeof web3 !== 'undefined'? web3.currentProvider : 
                               new Web3.providers.HttpProvider(web3url));

console.log(`web3.version: ${gegeweb3.version.api}`);

module.exports.web3init = function() { }

// To get ABI use command: solcjs LinkgearPoSToken.sol --abi
// Get Address from migrate
const contractABI = [{"constant":false,"inputs":[{"name":"_superNode","type":"address"},{"name":"_value","type":"uint256"},{"name":"_userStartTime","type":"uint256"}],"name":"addTransactionRewards","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"getStakeInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_rewardList","type":"address[]"},{"name":"_toBlock","type":"uint256"}],"name":"sendStakeBlockRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"promotionPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_transactionRewardsRate","type":"uint256"}],"name":"setTransactionRewardsRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_promotionRate","type":"uint256"}],"name":"setpromotionRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"promotionRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTransactionRewardsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOfWithdrawal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_blockNumber","type":"uint256"}],"name":"setLastRewardBlockNumber","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"linkgearToToken","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"timestamp","type":"uint256"}],"name":"ownerSetStakeStartTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxTotalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastRewardBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_superNode","type":"address"},{"name":"_userStartTime","type":"uint256"}],"name":"sendRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_superNode","type":"address"},{"name":"_userStartTime","type":"uint256"}],"name":"userSendToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"stakeOf","outputs":[{"name":"_stake","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMinStakeAmount","outputs":[{"name":"mStakeAmountr","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"chainStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"}],"name":"addStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stakeStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionRewardsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_token","type":"uint256"}],"name":"redeemToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipients","type":"address[]"},{"name":"_values","type":"uint256[]"}],"name":"batchTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"ownerBurnToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getpromotionRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_superNode","type":"address"},{"name":"_userStartTime","type":"uint256"}],"name":"deductRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMaxStakeHolder","outputs":[{"name":"mStakeHolder","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBlockRewards","outputs":[{"name":"bReward","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalInitialSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPromotionPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"setTokenName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getLastRewardBlockNumber","outputs":[{"name":"blockNumber","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxStakeHolder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_promotionPeriod","type":"uint256"}],"name":"setPromotionPeriod","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_symbol","type":"string"}],"name":"setTokenSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdrawStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"chainStartBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_blockReward","type":"uint256"}],"name":"setBlockRewards","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"blockRewards","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_exchangeRate","type":"uint256"}],"name":"setExchangeRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"stakeHolderList","outputs":[{"name":"nodeAddress","type":"address"},{"name":"stakeHolderBalance","type":"uint256"},{"name":"transactionRewards","type":"uint256"},{"name":"missBlockRewardsCount","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getExchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_minStakeAmount","type":"uint256"}],"name":"setMinStakeAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_maxStakeHolder","type":"uint256"}],"name":"setMaxStakeHolder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"sendStakeTransactionRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenSymbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minStakeAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"}],"name":"joinStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"removeStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getStakeNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"JoinStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"AddStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"RemoveStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"WithdrawStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"SendStakeBlockRewards","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"SendStakeTransactionRewards","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"miner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
const contractAddress = "0xb685989884F2219D02c1747110dD136eaa38388a";

const gegePOS = gegeweb3.eth.contract(contractABI).at(contractAddress);

// Need set default account, otherwise will get invalid address error
gegeweb3.eth.defaultAccount = gegeweb3.eth.coinbase;

// This function shows how to send rewards to user(publisher)
module.exports.sendRewards = function(uAddr, token, sAddr, uStart) {
   // transfer rewards
   const gasEstimate = gegePOS.sendRewards.estimateGas(uAddr,token,sAddr,uStart,
                       {from: gegeweb3.eth.coinbase});

   //console.log("estimate gas: " + gasEstimate);
   return gegePOS.sendRewards.sendTransaction(uAddr,token,sAddr,uStart,
                       {from:gegeweb3.eth.coinbase, gas:gasEstimate}) 
}

// This function shows how to deduct rewards from user(publisher)
module.exports.deductRewards = function(uAddress, token, sAddr, uStart) {
    return gegePOS.deductRewards(uAddr, token, sAddr, uStart)  
}

// This function shows how a user can send rewards publisher
module.exports.userSendToken = function(uAddr, toAddr,token, sAddr, uStart) {
    return gegePOS.userSendToken(uAddr, toAddr, token, sAddr,userStart)
}

// Balance of the account in the gege Chain
module.exports.balanceOf = function(acct) {
    return gegePOS.balanceOf(acct) 
}

// User join POS
module.exports.joinStake = function(addr, amount) {
    return gegePOS.joinStake.sendTransaction(addr,amount,
                    {from: gegeweb3.eth.coinbase, gas: "8000000"})
}

// user add more amount to account
module.exports.addStake = function(addr, amount) {
    return gegePOS.addStake.sendTransaction(addr,amount,
                    {from: gegeweb3.eth.coinbase, gas: "8000000"})
}

// user withdraw amount from account - but remain amount cannot below minmum 
// stake amount
module.exports.withdrawStake = function(addr, amount) {
    return gegePOS.withdrawStake.sendTransaction(addr,amount,
                    {from: gegeweb3.eth.coinbase, gas: "8000000"})
}

// remove user from stake
module.exports.removeStake = function(addr) {
    return gegePOS.removeStake.sendTransaction(addr,
                    {from: gegeweb3.eth.coinbase, gas: "8000000"})
}

//send rewards to stake holder
module.exports.sendBlockRewards = function() {
    const startBlock = Number(gegePOS.getLastRewardBlockNumber()) + 1;
    const currentBlock  = gegeweb3.eth.blockNumber;

    const addrList = getMinerList(startBlock, currentBlock)
 
    gegePOS.sendStakeBlockRewards.sendTransaction(addrList, currentBlock,
                       {from: gegeweb3.eth.coinbase, gas: "800000"})
}

module.exports.sendTransactionRewards = function() {
    return gegePOS.sendStakeTransactionRewards.sendTransaction(
          {from: gegeweb3.eth.coinbase, gas: "800000"})
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
{from: gegeweb3.eth.coinbase, gas: "800000"});
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
       {from:gegeweb3.eth.coinbase, gas: "800000"})

}
