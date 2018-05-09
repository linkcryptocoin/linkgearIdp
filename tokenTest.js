// node tokenTest.js
// purpose: test the smart contract functions in node.js
// 1) npm i web3
// 2) obtain the file "linkgearaccount.js" into the current folder
const linkgearaccount = require('./linkgearaccount.js');
const web3 = linkgearaccount.getWeb3();

const account1 = '0xbee735fb6571decd7b14d61b975187c3ef2db28b';
const account2 = '0x3c3ff8ad68cd65ee4df02335ded4303a6e0b0fcc';

// test 1. Checck Balance of this node
//   checkAllBalances()

// test 2. Test the balances of an account
//console.log(`account balance: ${account1} - ${linkgearaccount.getBalance(account1)}`)
console.log(`token balance: ${account2} - ${linkgearaccount.getTokenBalance(account2)}`)

// test 3. deduct rewards from user(publisher)
   deductRewards(account2, 1) 

// test 4. Send rewards to user(publisher)
   sendRewards(account2, 1)

// 5. user send rewards publisher or other user
//   userReward(user, privateKey, account2, 1)

//wait for MilliSeconds - wait(5000) wait 5 seconds
function wait(ms) {
    const start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

// This function shows how to send rewards to user(publisher)
function sendRewards(addr, amout) {
    // Balance before rewards
    console.log("   Account " + addr + " before rewards balance: " + linkgearaccount.getTokenBalance(addr));
    // transfer rewards
    const result = linkgearaccount.sendRewards(addr,amout) // the result will be the transaction hash
    if (result) {
        console.log('Wait 10 seconds before get transaction');
        wait(10000); // wait for 15 seconds
        str = JSON.stringify(web3.eth.getTransaction(result), null, 4);
        console.log(str);
    }
  
    // Balance after rewards
    console.log("If blockNumber is null, the transaction is not mined yet");
    console.log("   Account " + addr + " after rewards balance: " + linkgearaccount.getTokenBalance(addr));
}

// This function shows how to deduct rewards from user(publisher)
function deductRewards(addr, amout) {
    // Balance before deduction
    console.log(`Account ${addr} before deduction balance: ${linkgearaccount.getTokenBalance(addr)}`);

    // deduct rewards
    result = linkgearaccount.deductRewards(addr, amout) // the result will be the transaction hash

    if (result) {
        console.log('Wait 10 seconds before get transaction');
        wait(10000);
        str = JSON.stringify(web3.eth.getTransaction(result), null, 4);
        console.log(str);
    }
  
    // Balance after deduction
    console.log("If blockNumber is null, the transaction is not mined yet");
    console.log("   Account " + addr + " after rewards balance: " + linkgearaccount.getTokenBalance(addr));
}

// This function shows how a user can send rewards publisher
function userReward(fromAddr, privateKey, toAddr, amout) {
    result = linkgearaccount.transferFrom(fromAddr, privateKey, toAddr, amout) // the result will be the transaction hash
    if (result) {
        console.log('Wait 10 seconds before get transaction');
        wait(10000);
        str = JSON.stringify(web3.eth.getTransaction(result), null, 4);
        console.log(str);
    }
}

// Check the balances for all the accounts
function checkAllBalances() {
    var idx = 0;
    web3.eth.accounts.forEach( function(acct) {  // 1 ether = 1 ligear
         console.log("   Account[" + idx++ + "]:" +
         acct + " \tbalance: " + linkgearaccount.getTokenBalance(acct) + 
         "  token"); 
    })  
};

// Set Exchange Rate
function setExchangeRate() {
    linkgearaccount.setExchangeRate(200);
    console.log("set Exchange Rate")
}

// Get Exchange Rate
function getExchangeRate() {
    const result = linkgearaccount.getExchangeRate()
    console.log(result)
}

// Exchange Linkgear to Token
function linkgearToToken(addr, privcateKey, amount) {
    linkgearaccount.linkgearToToken(addr, privateKey, amount);
    console.log(`The token balance of addr ${addr} is: ${linkgearaccount.getTokenBalance(addr)} token`);
}

//redeem token
function redeemToken(addr, token) {
    linkgearaccount.redeemToken(addr, token);
    console.log("Token redeemed, please withdraw funtion to get ligear")
}

function withdraw(addr, privateKey) {
    linkgearaccount.withdraw(addr, privateKey);
    console.log(`The token balance of addr ${addr} is: ${linkgearaccount.getTokenBalance(addr)} token`);
}
