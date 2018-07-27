// Linkgear Class
// Author: Simon Li
// Date: July 27, 2018
// LinkGear Fundation, all  rights reserved
"use strict";

const fs = require('fs');

class Linkgear {  
    constructor(iConfigFile) {
       const configFile = (iConfigFile)? iConfigFile : '.configure.json'; 
       this.config = JSON.parse(fs.readFileSync(configFile));
       this.web3url = this.config.linkgear.web3url;

       const Web3 = require('web3');
       this.web3 = new Web3(typeof this.gegeweb3 !== 'undefined'? 
                       this.web3.currentProvider : 
                       new Web3.providers.HttpProvider(this.web3url));
      
       // Check the connectivity
        if (this.web3.isConnected()) 
           console.log(`web3.version: ${this.web3.version.api}`);
    }

    //The balance for a linkgear account
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

    // Create an account
    newAccount(privateKey) {
        return this.web3.personal.newAccount(privateKey);
    }
   
    // pending transactions
    pendingTransactions() {
       return this.web3.eth.getBlock('pending').transactions;
    }   
}

module.exports = Linkgear
           
