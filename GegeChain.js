// GegeChain Class
// Author: Simon Li
// Date: June 27, 2018
// LinkGear Fundation, all  rights reserved
"use strict";

const fs = require('fs');
const mnid = require('mnid');

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

const userNameSet = new Set();

class GegeChain {
    constructor(iConfigFile) {
        const configFile = (iConfigFile) ? iConfigFile : '.configure.json';

        this.config = JSON.parse(fs.readFileSync(configFile));
        this.smAddr = this.config.gegechain.smartcontractaddr;
        this.web3url = this.config.gegechain.web3url;
        this.defaultGas = this.config.gegechain.defaultgas;
        this.defaultSNode = this.config.gegechain.defaultsnode;

        this.dbo = null;
        
        // email 
        // Set the region 
        AWS.config.update({region: this.config.sys.awsregion});
        AWS.config.credentials = new AWS.SharedIniFileCredentials();

        const Web3 = require('web3');
        this.gegeweb3 = new Web3(typeof this.gegeweb3 !== 'undefined' ?
            this.gegeweb3.currentProvider :
            new Web3.providers.HttpProvider(this.web3url));


        // Check the connectivity
        if (this.gegeweb3.isConnected())
            console.log(`web3.version used by gegeChain: ${this.gegeweb3.version.api}`);

        // To get ABI use command: solcjs LinkgearPoSToken.sol --abi
        // Get Address from migrate
        const contractABI = [{ "constant": false, "inputs": [{ "name": "_superNode", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_userStartTime", "type": "uint256" }], "name": "addTransactionRewards", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "idx", "type": "uint256" }], "name": "getStakeInfo", "outputs": [{ "name": "", "type": "address" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint256" }, { "name": "", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_rewardList", "type": "address[]" }, { "name": "_toBlock", "type": "uint256" }], "name": "sendStakeBlockRewards", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "promotionPeriod", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_transactionRewardsRate", "type": "uint256" }], "name": "setTransactionRewardsRate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_promotionRate", "type": "uint256" }], "name": "setpromotionRate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "promotionRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getTransactionRewardsRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_addr", "type": "address" }], "name": "balanceOfWithdrawal", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_blockNumber", "type": "uint256" }], "name": "setLastRewardBlockNumber", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "linkgearToToken", "outputs": [{ "name": "", "type": "bool" }], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [{ "name": "timestamp", "type": "uint256" }], "name": "ownerSetStakeStartTime", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "maxTotalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "lastRewardBlockNumber", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "exchangeRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_superNode", "type": "address" }, { "name": "_userStartTime", "type": "uint256" }], "name": "sendRewards", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "withdraw", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_superNode", "type": "address" }, { "name": "_userStartTime", "type": "uint256" }], "name": "userSendToken", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_addr", "type": "address" }], "name": "stakeOf", "outputs": [{ "name": "_stake", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getMinStakeAmount", "outputs": [{ "name": "mStakeAmountr", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "chainStartTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "addStake", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_addr", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "stakeStartTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "transactionRewardsRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }, { "name": "_token", "type": "uint256" }], "name": "redeemToken", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getTokenName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipients", "type": "address[]" }, { "name": "_values", "type": "uint256[]" }], "name": "batchTransfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "ownerBurnToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getpromotionRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_superNode", "type": "address" }, { "name": "_userStartTime", "type": "uint256" }], "name": "deductRewards", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getMaxStakeHolder", "outputs": [{ "name": "mStakeHolder", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBlockRewards", "outputs": [{ "name": "bReward", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalInitialSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getPromotionPeriod", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }], "name": "setTokenName", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getLastRewardBlockNumber", "outputs": [{ "name": "blockNumber", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "maxStakeHolder", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_promotionPeriod", "type": "uint256" }], "name": "setPromotionPeriod", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_symbol", "type": "string" }], "name": "setTokenSymbol", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "withdrawStake", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "mintToken", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "chainStartBlockNumber", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_blockReward", "type": "uint256" }], "name": "setBlockRewards", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "blockRewards", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_exchangeRate", "type": "uint256" }], "name": "setExchangeRate", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "stakeHolderList", "outputs": [{ "name": "nodeAddress", "type": "address" }, { "name": "stakeHolderBalance", "type": "uint256" }, { "name": "transactionRewards", "type": "uint256" }, { "name": "missBlockRewardsCount", "type": "uint64" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getExchangeRate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_minStakeAmount", "type": "uint256" }], "name": "setMinStakeAmount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_maxStakeHolder", "type": "uint256" }], "name": "setMaxStakeHolder", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "sendStakeTransactionRewards", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getTokenSymbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "minStakeAmount", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "joinStake", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "removeStake", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getStakeNumber", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "addr", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "JoinStake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "addr", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "AddStake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "addr", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "RemoveStake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "addr", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "WithdrawStake", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "addr", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "SendStakeBlockRewards", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "addr", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "SendStakeTransactionRewards", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "burner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "miner", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }]

        const contractAddress = this.smAddr;

        this.gegeweb3.eth.defaultAccount = this.gegeweb3.eth.coinbase;
        this.gegeweb3.personal.unlockAccount(this.gegeweb3.eth.coinbase, this.getCoinbaseKey('userKey'));

        this.gegePOS = this.gegeweb3.eth.contract(contractABI).at(contractAddress);
    }

    // Check the connectivity
    isConnected() { return this.gegeweb3.isConnected() }

    // Check the address/account
    isAddress(addr) { return this.gegeweb3.isAddress(addr) }

    // Set a DB handler
    setMongoDbo(db) { 
        if (!this.dbo) this.dbo = db;
        this.addUsername("Simon");
   
        this.dbo.collection("users").find({}, {"local.username":1, _id:0}).toArray(function(err, users) {
            if (err) throw err;

            users.forEach(function(user) {
               if (user.local.username)
                  userNameSet.add(user.local.username);
            });
        });
    }

    // Get the GegeChain info including supernode, ...
    getGegeInfo() {
        const gegeInfo = {
                 "supernodes": []
              }
        gegeInfo.supernodes = Object.values(config.gegechain.supernodelist);
        return gegeInfo;
    }

    // Check the existence of a user name
    hasUsername(username) { 
        return userNameSet.has(username);
    }

    // Add a user name to the set
    addUsername(username) { 
        userNameSet.add(username);  // add it 
    }

    updateUser(user) {
        var {userId, email, username, dname} = user;
        delete user["userId"];
        delete user["email"];
        delete user["username"];
   
        if (!username || !dname || username !== dname.toLowerCase()) { 
            if (dname && !username)
                username = dname.toLowerCasea();
            delete user["dname"]
        }
   
        if (email) 
            email = email.toLowerCase();   

        const user_id = (typeof userId === "string")? ObjectId(userId) : userId;
        //console.log(typeof user_id);
        var where = {};
        if (user_id && typeof user_id === "object")
            where = {_id: user_id};
        else if (email)
            where = {"local.email": email};
        else if (username)
            where = {"local.username": username};
        else
            throw "Pleae provide userId, email or user name";

        var updateSet = { };
        for (var key in user) {
            var fldValue = user[key];  // field value
            if (fldValue) {
                var key2 = "local." + key;  // db field
                updateSet[key2] = fldValue;
                if (key === 'region') {// switch the super node
                    updateSet["local.snode"] = superNode[fldValue];
                }      
            }
        }
        //console.log(updateSet);

        this,dbo.collection("users").updateOne(where, { $set: updateSet }, function(err, res) {
            if (err) throw err;
            return true;
        });
        return true;
    }

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
        const d = (iDay) ? new Date(iDay) : new Date();

        const day = d.getDay();
        const diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    // Get the sunday of the current day 
    getSunday(iDay) {
        const d = (iDay) ? new Date(iDay) : new Date();
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }

    // Format a day to ISO format "yyyy-MM-ddThh:mm:ss.SECZ"
    formatISODate(date) {
        const d = (date) ? new Date(date) : new Date();
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-') + "T00:00:00.000Z";
    }

    // Send the rewards
    directlySendRewards(uAddr, token, sAddr, uStart) {
        const nToken = (typeof token === "string") ? parseInt(token) : token;
        if (nToken < 0) return false;

        // transfer rewards
        if (!sAddr || !this.gegeweb3.isAddress(sAddr)) sAddr = this.defaultSNode;
        // convert the milliseconds to the seconds
        if (!uStart) uStart = Date.now();
        const timeStamp = Math.floor(uStart / 1000);

        return this.gegePOS.sendRewards.sendTransaction(uAddr, token, sAddr, timeStamp, { from: this.gegeweb3.eth.coinbase, gas: this.defaultGas })
    }

    // Balance of the account in the gege Chain
    balanceOf(acct) {
        return this.gegePOS.balanceOf(acct)
    }

    encode(account) {
        const LINKGEAR_NETWORK = '0xbda';   // =3034
        return mnid.encode({
            network: LINKGEAR_NETWORK,
            address: account
        });
    }
    decode(daccount) {
        return mnid.decode(daccount).address
    }

    // get the super node address based on a region
    getSuperNode(region) {
      if (region && typeof region === "string")
          return this.config.gegechain.supernode[region];
      else
          return null;
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

        const appStr = (typeof app === 'string') ? app.toLowerCase() : "" + app;
        var ret;
        switch (appStr) {
            case '1':
            case 'chainpage':
                ret = this.handleChainPage(uAddr, sAddr, timeStamp, action.toLowerCase());
                break;

            case '2':
            case 'chainpost':
                ret = this.handleChainPost(uAddr, sAddr, timeStamp, action.toLowerCase());
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
        switch (action) {
            case 'comment':
                takenAwayToken = 5; break;

            case 'like':
                takenAwayToken = 5; break;

            case 'dislike':
                takenAwayToken = 10; break;

            default:
                throw `ChainPage: "${action}" not supported`;
        }

        return {
            result: this.gegePOS.deductRewards(uAddr, takenAwayToken, sAddr, uStart),
            message: `ChainPage "${action}" was completed in gegeChain`
        };
    }

    // Handle the ChainPost request
    handleChainPost(uAddr, sAddr, uStart, action) {
        var rule = { rewardToken: 0, limitPerDay: 0 };
        switch (action) {
            //temp reward update
            case 'login':
                rule = { rewardToken: 300, limitPerDay: 1 }; break;

            case 'post':
                rule = { rewardToken: 40, limitPerDay: 5 }; break;

            case 'comment':
                rule = { rewardToken: 40, limitPerDay: 5 }; break;

            case 'like':
                rule = { rewardToken: 10, limitPerDay: 10 }; break;

            case 'dislike':
                rule = { rewardToken: 10, limitPerDay: 10 }; break;
            //for PROD
            //   case 'login':
            //       rule = {rewardToken: 10, limitPerDay: 1}; break;

            //   case 'post':
            //       rule = {rewardToken: 20, limitPerDay: 5}; break;

            //   case 'comment':
            //       rule = {rewardToken: 20, limitPerDay: 5}; break;

            //   case 'like':
            //       rule = {rewardToken: 5, limitPerDay: 10}; break;

            //   case 'dislike':
            //       rule = {rewardToken: 5, limitPerDay: 10}; break;

            case 'referral':
                rule = { rewardToken: 10, limitPerDay: 99999 }; break;

            default:
                throw `ChainPost: "${action}" not supported`;
        }

        // Check the daily limitation
        const dateEnd = new Date();   // current time
        const dateBegin = new Date(this.formatISODate());  // The beginning of Today

        return { result: this.gegePOS.sendRewards(uAddr, rule.rewardToken, sAddr, uStart), message: `ChainPost "${action}" was completed in gegeChain` };
    }


    // This function shows how to deduct rewards from user(publisher)
    deductRewards(uAddr, token, sAddr, uStart) {
        const nToken = (typeof token === "string") ? parseInt(token) : token;
        if (nToken <= 0) return false;

        if (!sAddr || !this.gegeweb3.isAddress(sAddr)) sAddr = this.defaultSNode;

        // convert the milliseconds to the seconds
        if (!uStart) uStart = Date.now();
        const timeStamp = Math.floor(uStart / 1000);

        return this.gegePOS.deductRewards(uAddr, token, sAddr, timeStamp)
    }

    // This function shows how a user can send rewards publisher
    userSendToken(uAddr, toAddr, token, sAddr, uStart) {
        const nToken = (typeof token === "string") ? parseInt(token) : token;
        if (nToken <= 0) return false;

        if (!sAddr || !this.gegeweb3.isAddress(sAddr)) sAddr = this.defaultSNode;

        // convert the milliseconds to the seconds
        if (!uStart) uStart = Date.now();
        const timeStamp = Math.floor(uStart / 1000);

        return this.gegePOS.userSendToken(uAddr, toAddr, token, sAddr, timeStamp)
    }

    // Web3 methods/attributes
    web3call(web3Func, args) {
        const web3 = this.gegeweb3;
        const gege = this.gegePOS;
        var fromBlockNum = 0;
        var toBlockNum = 0;
        var num = 0;
        var idx = 0;

        const strFunc = web3Func.toLowerCase();
        switch (strFunc) {
            case 'eth.coinbase':
                return web3.eth.coinbase;
            case 'eth.accounts':
                return web3.eth.accounts;
            case 'eth.filter':
                return web3.eth.filter("latest");
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
                return web3.eth.getTransactionFromBlock(args[0], args[1]);
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
                const blkNum = (typeof args[0] === "string") ? Number(args[0])
                    : args[0];
                return web3.clinue.getSnapshot(web3.toHex(blkNum)).recents;
            case 'eth.getblocktransactioncount':
                return web3.eth.getBlockTransactionCount(args[0]);
            case 'eth.gettransactionreceipt':
                return web3.eth.getTransactionReceipt(args[0]);
            case 'eth.gettransaction':
                return web3.eth.getTransaction(args[0]);
            case 'getblocks':
                var arrBlocks = [];
                num = (args[0]) ? args[0] : 10;
                fromBlockNum = (args[1]) ? args[1] : web3.eth.blockNumber;
                toBlockNum = (fromBlockNum > num) ? fromBlockNum - num : 0;
                for (idx = fromBlockNum; idx > toBlockNum; idx--) {
                    arrBlocks.push(web3.eth.getBlock(idx))
                }
                return arrBlocks;

            case 'gettransactionsfromblocks':
                var arrTrans = [];
                num = (args[0]) ? args[0] : 10;
                fromBlockNum = (args[1]) ? args[1] : web3.eth.blockNumber;
                toBlockNum = (fromBlockNum > num) ? fromBlockNum - num : 0;
                for (idx = fromBlockNum; idx > toBlockNum; idx--) {
                    arrTrans.push(web3.eth.getTransactionFromBlock(idx))
                }
                return arrBlocks;

            case 'updatestats':
                var st = {};
                st.blockNum = web3.eth.blockNumber;
                if (st.blockNum === undefined)
                    return st;

                var blockNewest = web3.eth.getBlock(st.blockNum);
                if (blockNewest === undefined)
                    return st;

                // difficulty
                st.difficulty = Number(blockNewest.difficulty);
                st.difficultyToExponential = st.difficulty.toExponential(3);
                st.totalDifficulty = Number(blockNewest.totalDifficulty);
                st.totalDifficultyToExponential = st.totalDifficulty.toExponential(3);
                st.totalDifficultyDividedByDifficulty = st.totalDifficulty / st.difficulty;
                st.AltsheetsCoefficient = st.totalDifficultyDividedByDifficulty / st.blockNum;
                // large numbers still printed nicely:
                //st.difficulty_formatted = st.difficulty.toFormat(0);

                // Gas Limit
                st.gasLimit = blockNewest.gasLimit; //.toFormat(0) + " m/s";

                // Time
                var newDate = new Date();
                newDate.setTime(blockNewest.timestamp * 1000);
                st.time = newDate.toUTCString();

                st.secondsSinceBlock1 = blockNewest.timestamp - 1438226773;
                st.daysSinceBlock1 = (st.secondsSinceBlock1 / 86400).toFixed(2);

                // Average Block Times:
                // TODO: make fully async, put below into 'fastInfosCtrl'
                var blockBefore = web3.eth.getBlock(st.blockNum - 1);
                if (blockBefore !== undefined) {
                    st.blocktime = blockNewest.timestamp - blockBefore.timestamp;
                }
                st.range1 = 100;
                var range = st.range1;
                var blockPast = web3.eth.getBlock(Math.max(st.blockNum - range, 0)); if (blockBefore !== undefined) {
                    st.blocktimeAverage1 = ((blockNewest.timestamp - blockPast.timestamp) / range).toFixed(2);
                }

                st.range2 = 1000;
                range = st.range2;
                blockPast = web3.eth.getBlock(Math.max(st.blockNum - range, 0));
                if (blockBefore !== undefined) {
                    st.blocktimeAverage2 = ((blockNewest.timestamp - blockPast.timestamp) / range).toFixed(2);
                }

                st.range3 = 10000;
                range = st.range3;
                blockPast = web3.eth.getBlock(Math.max(st.blockNum - range, 0));
                if (blockBefore !== undefined) {
                    st.blocktimeAverage3 = ((blockNewest.timestamp - blockPast.timestamp) / range).toFixed(2);
                }

                st.range4 = 100000;
                range = st.range4;
                blockPast = web3.eth.getBlock(Math.max(st.blockNum - range, 0));
                if (blockBefore !== undefined) {
                    st.blocktimeAverage4 = ((blockNewest.timestamp - blockPast.timestamp) / range).toFixed(2);
                }

                range = st.blockNum;
                blockPast = web3.eth.getBlock(1);
                if (blockBefore !== undefined) {
                    st.blocktimeAverageAll = ((blockNewest.timestamp - blockPast.timestamp) / range).toFixed(2);
                }
                st.isConnected = web3.isConnected();
                st.versionApi = web3.version.api;
                st.versionClient = web3.version.client;
                st.versionNetwork = web3.version.network;
                st.versionCurrency = web3.version.ethereum;
                st.versionWhisper = '0.0*';
                return (st);

            default:
                throw `${func} is not supported`;
        }
    }
    
    // Valid email address based on our pattern?
    isValidEmail(emailStr) {
        if (typeof emailStr != 'string')
           throw 'Invalid email type';

        const emailPattern = /^.+@.+\..+$/;
        return emailPattern.test(emailStr);
    }

    // Send ae email via aws
    sendAwsEmailInt(receiver, iSubject, iMessage, iSender) {
       // Create sendEmail params 
       const currentDate = new Date().toDateString();
       const currentTime = new Date().toLocaleTimeString();
       const sender = (iSender)? iSender : 'support@linkgear.io';
       const subject = `${iSubject} at ${currentTime} on ${currentDate}`;
       const message = `${iMessage}`;
       const arrReceiver = (Array.isArray(receiver))? receiver : [receiver];

       const params = {
           Destination: { /* required */
               ToAddresses: arrReceiver
           },
           Message: { /* required */
               Body: { /* required */
                   Html: {
                       Charset: "UTF-8",
                       Data: `${message}`
                   },
                   Text: {
                       Charset: "UTF-8",
                       Data: `${message}`
                   }
               },
               Subject: {
                   Charset: 'UTF-8',
                   Data: `${subject}`  /* 'Test email from server' */
               }
           },
           Source: `${sender}`,   //'support@linkgear.io', /* required */
           ReplyToAddresses: [
           ],
       };
   
       // Create the promise and SES service object
       const sendPromise = new AWS.SES({apiVersion: '2012-10-17'}).sendEmail(params).promise();

       // Handle promise's fulfilled/rejected states
       sendPromise.then(function(data) {
           console.log(`email sent to ${receiver}:  ${data.MessageId}`);
           return {result: true, message: `An email sent to ${receiver}`};
       }).catch(function(err) {
           console.error(err, err.stack);
           return {result: false, message: `${err.stack}`};
       });
  
       return {result: true, message: `An email will be sent to ${receiver}`};
    }
    
    // Aws Email: receiver, subject, message
    sendAwsEmail(iReceiver, iSubject, iMessage, iSender) {
       var emailFunc = this.sendAwsEmailInt;  

       var bMultiEntries = false;
       var bUserNameUsed = false;
       var receiver = iReceiver; // pass the data type implicitly

       if (typeof iReceiver === 'string') {
           receiver = iReceiver.toLowerCase();
           if (!this.isValidEmail(receiver))  // a user name
               bUserNameUsed = true;
       }        
       else if (Array.isArray(receiver)) { // an array for multiple emails or user names
           bMultiEntries = true;
           for (var idx = 0; idx < receiver.length; idx++) { 
              receiver[idx] = iReceiver[idx].toLowerCase();
              if (!this.isValidEmail(receiver[idx]))
                 bUserNameUsed = true; 
           }   
       }
       else
           throw 'The receiver type is not support';

       if (bUserNameUsed) { // user name
          if (!bMultiEntries) { // single user name
             this.dbo.collection("users").findOne({"local.username": receiver}, function(err, user) {
                 if (err) throw err;
                 console.log(`user name is ${user.local.username}`);
                 return emailFunc(user.local.email, iSubject, iMessage, iSender);
             });
          }
          else { 
             this.dbo.collection("users").find({"local.username": {$in: receiver}}).toArray(function(err, users) {
                 if (err) throw err;
                 const arrReceiver = [];
                 users.forEach(function(user) {
                     arrReceiver.push(user.local.email);
                 });

                 return emailFunc(arrReceiver, iSubject, iMessage, iSender);
             });
          } 
       } 
       else   
          return emailFunc(receiver, iSubject, iMessage, iSender);
    }

    // More
}

module.exports = GegeChain
