# Linkgear Idp
## What make linkgearIdp?
1) The ooth server index.js running on port 8091 by default,  can be configured 
2) The sample client page index.html for api demo and presentation
3) linkgearPOS.js is used for linkgear gegeChain account creation and web3 service
4) ooth-local.js - a customizing and enhanced version for linkgear Idp and api
5) the collection "users" is stored on an mongodb(mongo --port 27017 by default)
6) the collection "translog" is used for tracking all the token transaction and account activity

## api included
1) user management: login, register, status/profile 
2) user setting: set-username, set-email  
3) user checking: generate-verification-token, verify
4) password management: forgot-password, reset-password, change-password
5) gegeChain token operation: balanceOf, sendRewards, deductRewards, userSendToken
6) stake operation: joinStake addStake, withdrawStake, removeStake
7) account management: register, linkAccount

## Server Start
1) yarn -- collect/download all the packages
2) yarn start [options] or forever start index.js [options] (options: --port, --nocors --https, --nolog --qadb)
3) or use port 3200 with https: yarn start --port 3200 --https

## Client page
http://linkcryptocoin.com:8091
