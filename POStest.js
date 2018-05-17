const linkgearPOS = require('./linkgearPOS.js');

linkgearPOS.web3init();

const accounts = ['0x5909faacedaa8c5a8ee2098bbc3702db026763ef',
                  '0xe0b14ede829c87a7a5b91bf00faf33f583ba62ba',
                  '0x28297c31ca42ff7c218ccd2a72fb6e459c1c3d16'];
// How to use the POStest.js
// In gligear console, load the script file
// > loadScript("E:/Project/src/truffle/LinkgearPosToken/test/POStest.js")
//
// Send rewards to user(publisher)
//sendRewards(accounts[1],10,'0x',Date.now());
//sendRewards(linkgearPOS.gegeweb3().eth.accounts[1],10,linkgearPOS.gegeweb3().eth.coinbase,Date.now());
//sendRewards(linkgearPOS.gegeweb3().eth.accounts[1],10,'0x0',Date.now());
//
// deduct rewards from user(publisher)
//  > deductRewards(userAddress, token,superNodeAddress,userStartTime) 
//deductRewards(linkgearPOS.gegeweb3().eth.accounts[1],10,linkgearPOS.gegeweb3().eth.coinbase,Date.now());
//deductRewards(linkgearPOS.gegeweb3().eth.accounts[1],10,'0x0',Date.now());
//
// user send token to other user
//  > userSendToken(userAddress, toAddress, superNodeAddress,userStartTime)
//
// Checck Balance of this node
   checkAllBalances()
//
// User join POS
//  joinStake(linkgearPOS.gegeweb3().eth.accounts[1], 5) 
// 
// user add more amount to POS
//  addStake(linkgearPOS.gegeweb3().eth.accounts[1], 3)
//
// user withdraw amount from POS - but remaining amount cannot below minmum stake amount
//  withdrawStake(linkgearPOS.gegeweb3().eth.accounts[1], 8)
//
// remove user from POS. The holdered stake amount will add back to user's balance
//   removeStake(linkgearPOS.gegeweb3().eth.accounts[1])
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
  console.log("   Account " + userAddress + " before rewards balance: " + linkgearPOS.balanceOf(userAddress));

  // transfer rewards
  linkgearPOS.sendRewards(userAddress, token,superNodeAddress,userStartTime);
  
  // Balance after rewards
  console.log("If blockNumber is null, the transaction is not mined yet");
  console.log("   Account " + userAddress + " after rewards balance: " + linkgearPOS.balanceOf(userAddress));
}

// This function shows how to deduct rewards from user(publisher)
function deductRewards(userAddress, token,superNodeAddress,userStartTime) {
  // Balance before deduction
  console.log("   Account " + userAddress + " before deduction balance: " + linkgearPOS.balanceOf(userAddress));

  // deduct rewards
  result = linkgearPOS.deductRewards(userAddress, token,superNodeAddress,userStartTime)  

  if (result) {
    str = JSON.stringify(linkgearPOS.gegeweb3().eth.getTransaction(result), null, 4);
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
    linkgearPOS.checkAllBalances();
}

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
