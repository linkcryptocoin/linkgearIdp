// GegeChain Class
// Author: Simon Li
// Date: June 27, 2018
// LinkGear Fundation, all  rights reserved
"use strict";

const fs = require('fs');
const mnid = require('mnid');

class GegeChain {  
   constructor(iConfigFile) {
       const configFile = (iConfigFile)? iConfigFile : '.configure.json'; 
           
       this.config = JSON.parse(fs.readFileSync(configFile));
       this.smAddr = this.config.gegechain.smartcontractaddr;
       this.web3url = this.config.gegechain.web3url;
       this.defaultGas = this.config.gegechain.defaultgas;
       this.defaultSNode = this.config.gegechain.defaultsnode;

       const Web3 = require('web3');

       this.gegeweb3 = new Web3(typeof this.gegeweb3 !== 'undefined'? 
                       gegeweb3.currentProvider : 
                       new Web3.providers.HttpProvider(this.web3url));
      
   
       // Check the connectivity
       if (this.gegeweb3.isConnected()) 
          console.log(`web3.version used by gegeChain: ${this.gegeweb3.version.api}`);

// To get ABI use command: solcjs LinkgearPoSToken.sol --abi
// Get Address from migrate
const contractABI = [{"constant":false,"inputs":[{"name":"_superNode","type":"address"},{"name":"_value","type":"uint256"},{"name":"_userStartTime","type":"uint256"}],"name":"addTransactionRewards","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"idx","type":"uint256"}],"name":"getStakeInfo","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_rewardList","type":"address[]"},{"name":"_toBlock","type":"uint256"}],"name":"sendStakeBlockRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"promotionPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_transactionRewardsRate","type":"uint256"}],"name":"setTransactionRewardsRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_promotionRate","type":"uint256"}],"name":"setpromotionRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"promotionRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTransactionRewardsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOfWithdrawal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_blockNumber","type":"uint256"}],"name":"setLastRewardBlockNumber","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"linkgearToToken","outputs":[{"name":"","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"timestamp","type":"uint256"}],"name":"ownerSetStakeStartTime","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"maxTotalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastRewardBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"exchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_superNode","type":"address"},{"name":"_userStartTime","type":"uint256"}],"name":"sendRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"},{"name":"_superNode","type":"address"},{"name":"_userStartTime","type":"uint256"}],"name":"userSendToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"stakeOf","outputs":[{"name":"_stake","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMinStakeAmount","outputs":[{"name":"mStakeAmountr","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"chainStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"}],"name":"addStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stakeStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"transactionRewardsRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_token","type":"uint256"}],"name":"redeemToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenName","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_recipients","type":"address[]"},{"name":"_values","type":"uint256[]"}],"name":"batchTransfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"ownerBurnToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getpromotionRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_superNode","type":"address"},{"name":"_userStartTime","type":"uint256"}],"name":"deductRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getMaxStakeHolder","outputs":[{"name":"mStakeHolder","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getBlockRewards","outputs":[{"name":"bReward","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalInitialSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPromotionPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"}],"name":"setTokenName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getLastRewardBlockNumber","outputs":[{"name":"blockNumber","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maxStakeHolder","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_promotionPeriod","type":"uint256"}],"name":"setPromotionPeriod","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_symbol","type":"string"}],"name":"setTokenSymbol","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"}],"name":"withdrawStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"chainStartBlockNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_blockReward","type":"uint256"}],"name":"setBlockRewards","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"blockRewards","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_exchangeRate","type":"uint256"}],"name":"setExchangeRate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"stakeHolderList","outputs":[{"name":"nodeAddress","type":"address"},{"name":"stakeHolderBalance","type":"uint256"},{"name":"transactionRewards","type":"uint256"},{"name":"missBlockRewardsCount","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getExchangeRate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_minStakeAmount","type":"uint256"}],"name":"setMinStakeAmount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_maxStakeHolder","type":"uint256"}],"name":"setMaxStakeHolder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"sendStakeTransactionRewards","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getTokenSymbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minStakeAmount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_value","type":"uint256"}],"name":"joinStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"}],"name":"removeStake","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getStakeNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"JoinStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"AddStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"RemoveStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"WithdrawStake","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"SendStakeBlockRewards","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"SendStakeTransactionRewards","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"burner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"miner","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

     const contractAddress = this.smAddr;

     this.gegeweb3.eth.defaultAccount = this.gegeweb3.eth.coinbase;
     this.gegeweb3.personal.unlockAccount(this.gegeweb3.eth.coinbase, this.getCoinbaseKey('userKey'));

     this.gegePOS = this.gegeweb3.eth.contract(contractABI).at(contractAddress);
   }

   // Check the connectivity
   isConnected() { return this.gegeweb3.isConnected() }

   // Check the address/account
   isAddress(addr) { return this.gegeweb3.isAddress(addr) }

   // Create an account
   createAccount(privateKey) {
        const account = this.gegeweb3.personal.newAccount(privateKey);
        return account;   
   }

   // Get the private key
   getCoinbaseKey(fake) {
      const file = this.config.gegechain.keyfile;
      const [keyInput, start, end, dummy] = fs.readFileSync(file).toString().split('@@');
      return keyInput.slice(parseInt(start), parseInt(end));
   }

   // Get the monday of the current day 
   getMonday(iDay) {
       const d = (iDay)? new Date(iDay) : new Date();

       const day = d.getDay();
       const diff = d.getDate() - day + (day == 0 ? -6 : 1);
       return new Date(d.setDate(diff));
   }
   
   // Get the sunday of the current day 
   getSunday(iDay) {
        const d = (iDay)? new Date(iDay) : new Date();
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
   }

   // Format a day to ISO format "yyyy-MM-ddThh:mm:ss.SECZ"
   formatISODate(date) {
        const d = (date)? new Date(date) : new Date();
        var   month = '' + (d.getMonth() + 1);
        var   day = '' + d.getDate();
        const year = d.getFullYear();
   
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-') + "T00:00:00.000Z";
   }

   // Send the rewards
   directlySendRewards(uAddr, token, sAddr, uStart) {
       const nToken = (typeof token === "string")? parseInt(token) : token;
       if (nToken < 0) return false;
   
       // transfer rewards
       if (!sAddr || !this.gegeweb3.isAddress(sAddr)) sAddr = this.defaultSNode;
       // convert the milliseconds to the seconds
       if (!uStart) uStart = Date.now();
          const timeStamp = Math.floor(uStart / 1000);

       return this.gegePOS.sendRewards.sendTransaction(uAddr,token,sAddr,timeStamp, {from:this.gegeweb3.eth.coinbase, gas:this.defaultGas}) 
   }

   // Balance of the account in the gege Chain
   balanceOf(acct) {
       return this.gegePOS.balanceOf(acct) 
   }

   encode(account) {
       const LINKGEAR_NETWORK = '0xbda';   // =3034
       return mnid.encode({ network: LINKGEAR_NETWORK, 
                            address: account
                         });
   }
   decode(daccount) {
       return mnid.decode(daccount).address
   }
 
   // userAction - gegeChain operation
   // app: ["ChainPage", "ChainPost"]
   // action: ["comment", "like", "dislike", "post", "login"]
   // uAddr - address/account, sAddr - super node, uStart - start time
   userAction(uAddr, sAddr, uStart, app, action) {
       // transfer rewards
       if (!sAddr || !this.gegeweb3.isAddress(sAddr)) sAddr = this.defaultSNode;
       // convert the milliseconds to the seconds
       if (!uStart) uStart = Date.now();
          const timeStamp = Math.floor(uStart / 1000);
       
       const appStr = (typeof app === 'string')? app.toLowerCase() : "" + app; 
       var ret;
       switch(appStr) {
          case '1':
          case 'chainpage':
          ret = handleChainPage(uAddr, sAddr, timeStamp, action.toLowerCase()); 
          break;

          case '2':
          case 'chainpost':
          ret = handleChainPost(uAddr, sAddr, timeStamp, action.toLowerCase()); 
          break;
 
          //case 'please add more':
          //   ret = handeApp(...);
          //   break;
          default:
          throw `the application ${app} is not supported yet`;
       }
       return ret;
   }

   // Handle the ChainPage request
   handleChainPage(uAddr, sAddr, uStart, action) {
       var takenAwayToken = 0;
       switch(action) {
          case 'comment':
              takenAwayToken = 5; break;
          
          case 'like':
              takenAwayToken = 5;  break;
          
          case 'dislike':
              takenAwayToken = 10; break;
          
          default: 
              throw `ChainPage: "${action}" not supported`;  
      }
   
      return {result: this.gegePOS.deductRewards(uAddr, takenAwayToken, sAddr, uStart),
           message: `ChainPage "${action}" was completed in gegeChain`};
    } 

    // Handle the ChainPost request
    handleChainPost(uAddr, sAddr, uStart, action) {
       var rule = {rewardToken: 0, limitPerDay: 0}; 
       switch(action) {
          case 'login':
              rule = {rewardToken: 10, limitPerDay: 1}; break;
          
          case 'post':
              rule = {rewardToken: 20, limitPerDay: 5}; break;
      
          case 'comment':
              rule = {rewardToken: 20, limitPerDay: 5}; break;
      
          case 'like':
              rule = {rewardToken: 5, limitPerDay: 10}; break;
      
          case 'dislike':
              rule = {rewardToken: 5, limitPerDay: 10}; break;
      
          case 'referral':
              rule = {rewardToken: 10, limitPerDay: 99999}; break;
          
          default: 
              throw `ChainPost: "${action}" not supported`;  
      }
     
      // Check the daily limitation
      const dateEnd = new Date();   // current time
      const dateBegin = new Date(formatISODate());  // The beginning of Today
   
      return {result: this.gegePOS.sendRewards(uAddr,rule.rewardToken,sAddr,uStart), message: `ChainPost "${action}" was completed in gegeChain`};
   }
   
   // Web3 methods/attributes
   web3call(web3Func, args) {
      const web3 = this.gegeweb3;
      const gege = this.gegePOS;
      const strFunc = web3Func.toLowerCase();
      switch (strFunc) {
          case 'eth.coinbase':
              return web3.eth.coinbase;
          case 'eth.accounts':
              return web3.eth.accounts;
          case 'eth.filter':
              return JSON.stringify(web3.eth.filter("latest")); 
          case 'eth.blocknumber': 
              return web3.eth.blockNumber; 
          case 'eth.getblock':
              return web3.eth.getBlock(args[0]); 
          case 'isconnected':
              return web3.isConnected(); 
          case 'version.api':
              return web3.version.api;
          case 'version.client':
              return web3.version.client;
          case 'version.ethereum': 
              return web3.version.ethereum;
          case 'version.whisper':
              return "0.0*"; //web3.version.whisper;
          case 'version.network':
              return web3.version.network;
          case 'eth.getTransactionfromblock': 
              return JSON.stringify(web3.eth.getTransactionFromBlock(args[0], args[1]));
          case 'getexchangerate':
              return gege.getExchangeRate();
          case 'tohex':
              return web3.toHex(args[0]);
          case 'fromwei':
              return web3.fromWei(args[0], "ether");
          case 'towei':
              return web3.toWei(args[0], "ether");
          case 'isaddress':
              return web3.isAddress(args[0]);
          case 'eth.getbalance':
              return web3.eth.getBalance(args[0]);
          case 'eth.gettransactioncount':
              return web3.eth.getTransactionCount(args[0]);
          case 'eth.getcode':
              return web3.eth.getCode(args[0]);
          case 'balanceof':
              return gege.balanceOf(args[0]);
          case 'clique.getsnapshot.recents':
              const blkNum = (typeof args[0] === "string")? Number(args[0])
                                                          : args[0];
              return web3.clinue.getSnapshot(web3.toHex(blkNum)).recents;
          case 'eth.getblocktransactioncount':
              return web3.eth.getBlockTransactionCount(args[0]);
          case 'eth.gettransactionreceipt':
              return JSON.stringify(web3.eth.getTransactionReceipt(args[0]));
          case 'eth.gettransaction':
              return JSON.stringify(web3.eth.getTransaction(args[0]));
          default:
             throw `${func} is not supported`;
      }    
   }
}

module.exports = GegeChain
