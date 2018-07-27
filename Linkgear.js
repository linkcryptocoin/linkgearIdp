// Purpose: Linkgear Class for encapsulating the web3 calls
// Author : Simon Li
// Date   : July 27, 2018
// LinkGear Fundation, all  rights reserved

// How to use this class:
//const Linkgear = require('./Linkgear.js');
//const linkgear = new Linkgear();
//console.log(`The balance of ${addr} is ${linkgear.getBalance(addr)}`);

"use strict";

const fs = require('fs');

class Linkgear {  
    constructor(iConfigFile) {
        const configFile = (iConfigFile)? iConfigFile : '.configure.json'; 
        const config = JSON.parse(fs.readFileSync(configFile));
        const web3url = config.linkgear.web3url;

        const Web3 = require('web3');
        this.web3 = new Web3(typeof this.web3 !== 'undefined'? 
                        this.web3.currentProvider : 
                        new Web3.providers.HttpProvider(web3url));
      
        // Check the connectivity
        if (this.web3.isConnected()) 
            console.log(`web3.version: ${this.web3.version.api}`);
        else
            throw 'unable to connect Linkgear web3 service';
    }

    //The balance for a linkgear account/address
    getBalance(account, more) {
        if (!account) return 0.00;

        if (!this.web3.isAddress(account))
            throw `${account} is an invalid account`;

        // more - pending, latest 
        if (!more) more = 'latest';

        // ether = ligear
        const weiValue = this.web3.eth.getBalance(account, more);
        return Number(this.web3.fromWei(weiValue));
    }

    // Create an account/address
    newAccount(privateKey) {
        return this.web3.personal.newAccount(privateKey);
    }
   
    // pending transactions
    pendingTransactions() {
       return this.web3.eth.getBlock('pending').transactions;
    }
    
    // get Transaction
    getTransaction(txHash) {
       return this.web3.eth.getTransaction(txHash)
    }   
    
    // More behaviors/methods...
}

module.exports = Linkgear
