const linkgearPOS = require('./linkgearPOS.js');

linkgearPOS.init();

// How to use the POStest.js
// In gligear console, load the script file
// > loadScript("E:/Project/src/truffle/LinkgearPosToken/test/POStest.js")
//
// Send rewards to user(publisher)
//   > sendRewards(userAddress, token,superNodeAddress,userStartTime)
//
// deduct rewards from user(publisher)
//  > deductRewards(userAddress, token,superNodeAddress,userStartTime) 
//
// user send token to other user
//  > userSendToken(userAddress, toAddress, superNodeAddress,userStartTime)
//
// Checck Balance of this node
   linkgearPOS.checkAllBalances()
//
// User join POS
//  > joinStake(addr, amount) 
// 
// user add more amount to POS
//  > addStake(addr, amount)
//
// user withdraw amount from POS - but remaining amount cannot below minmum stake amount
//  > withdrawStake(addr, amount)
//
// remove user from POS. The holdered stake amount will add back to user's balance
//  > removeStake(addr)
//
// get List fo all Stake Holders
//  > getStakeHolderList()
// 
// send block rewards to stake holder - The function will calculate the total rewards:
//  totalRewards = (currentBlockNumber - lastRewardBlockNumber) * blockReward
//  then get a list of miners who generated blocks during lastRewardBlockNumber to currentBlockNumber
//  then send rewards to these miners according their percentage of stake.
//  > sendStakeBlockRewards()
//
// Send transaction rewards to supernode - schedule this function to be called at certion period,
// for example everyday. 
// > sendStakeTransactionRewards()

// This function shows how to send rewards to user(publisher)
function sendRewards(userAddress, token,superNodeAddress,userStartTime) {
  // Balance before rewards
  console.log("   Account " + userAddress + " before rewards balance: " + myPOS.balanceOf(userAddress));

  // transfer rewards
  linkgearPOS.sendRewards(userAddress, token,superNodeAddress,userStartTime);
  
  // Balance after rewards
  console.log("If blockNumber is null, the transaction is not mined yet");
  console.log("   Account " + userAddress + " after rewards balance: " + linkgearPOS.balanceOf(userAddress));
}

// This function shows how to deduct rewards from user(publisher)
function deductRewards(userAddress, token,superNodeAddress,userStartTime) {
  // Balance before deduction
  console.log("   Account " + userAddress + " before deduction balance: " + myPOS.balanceOf(userAddress));

  // deduct rewards
  result = linkgearPOS.deductRewards(userAddress, token,superNodeAddress,userStartTime)  

  if (result) {
    str = JSON.stringify(eth.getTransaction(result), null, 4);
    console.log(str);
  }
  
  // Balance after deduction
  console.log("If blockNumber is null, the transaction is not mined yet");
  console.log("   Account " + userAddress + " after rewards balance: " + linkgearPOS.balanceOf(userAddress));
}

// This function shows how a user can send rewards publisher
function userSendToken(userAddress, toAddress,token, superNodeAddress,userStartTime) {

  result = linkgearPOS.userSendToken(userAddress, toAddress,token, superNodeAddress,userStartTime)

  if (result) {  
    str = JSON.stringify(eth.getTransaction(result), null, 4);
    console.log(str);
  }
}

// Check the balances for all the accounts
function checkAllBalances() {
  var idx = 0;
  eth.accounts.forEach( function(acct) {  // 1 ether = 1 ligear
      console.log("   Account[" + idx + "]:" +
       acct + " \tbalance: " + linkgearPOS.balanceOf(acct) + 
       "  token"
      ); 
      idx++; 
  })  
};

// User join POS
function joinStake(addr, amount) {
    result = linkgearPOS.joinStake(addr,amount)
    console.log(result)
}

// user add more amount to account
function addStake(addr, amount) {
    result = linkgearPOS.addStake(addr,amount);
    console.log(result)
}

// user withdraw amount from account - but remain amount cannot below minmum
//  stake amount
function withdrawStake(addr, amount) {
    result = linkgearPOS.withdrawStake(addr,amount)
    console.log(result)
}

// remove user from stake
function removeStake(addr) {
    result = linkgearPOS.removeStake(addr)
    console.log(result)
}

//send rewards to stake holder
function sendBlockRewards() {
    linkgearPOS.sendBlockRewars();
}

function sendTransactionRewards() {
    linkgearPOS.sendTransactionRewards();
}

function transferBalance() {
    linkgearPOS.transferBalance()
}

function getStakeHolderInfo() {
    linkgearPOS.getStakeHolderInfo();
}

function groupJoinStake() {
    linkgearPOS.groupJoinState();
}

function testBlockRewards() {
    linkgearPOS.textBlockRewards();
}
