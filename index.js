const {MongoClient, ObjectId} = require('mongodb')
const express = require('express')
const session = require('express-session')
const {promisify} = require('util')
const Ooth = require('ooth')
const OothMongo = require('ooth-mongo')
const https = require('https')
const fs = require('fs')
const OOTH_PATH = '/auth'
const cors = require('cors')  

const MONGO_HOST_QA = 'mongodb://34.238.58.243:27017'
const MONGO_HOST_LOCAL = 'mongodb://localhost:27017'
const HOST_LOCAL = 'https://localhost'
const HOST_LOCALN = 'http://localhost'
//const PORT = 3000
//const MONGO_HOST = 'mongodb://172.31.83.105:32786'
const MONGO_DB = 'linkgear'
const HOST = 'https://172.31.83.105'
const HOSTN = 'http://172.31.83.105'
//const PORT = 8091
const SECRET = 'linkgearsecret'
const SHARED_SECRET = 'linkgearsharedsecret'

const oothLocal = require('./ooth-local.js')  // Linkgear
const linkgearPOS = require('./linkgearPOS.js')  // Linkgear

//////////////////////////////////////////////////////
var PORT      = 8091    // Ddefault running port
//var rpcUrl    = "";     // RPC connected to the gegeNode
var qadb      = false;  // QA Database flag
var httpsRun  = false;  // https or http, default is http
var nocors    = false;  // no cors(Cross Original Resource Share) checking
var noLogging = false;  // Logging control
// Get the port number if provided in the arguments
var prearg = "";
process.argv.forEach(function (val, index, array) {
   //console.log(`val: ${val}`);
   if (/^(-{1,2}[p|P][o|O][r|R][t|T])$/.test(prearg) && !isNaN(val)) {
      PORT = val;
   }  
   else if (/^(-{1,2}[q|Q][a|A][d|D][b|B])$/.test(val))
      qadb = true;
   else if (/^(-{1,2}[n|N][o|O][c|C][o|O][r|R][s|S])$/.test(val))
      nocors  = true;
   else if (/^(-{1,2}[h|H][t|T]{2}[p|P][s|S])$/.test(val))
      httpsRun = true;
   else if (/^(-{1,2}[r|R][p|P][c|C][u|U][r|R][l|L])$/.test(prearg)) {	
      linkgearPOS.web3init(val);
   }
   else if (/^(-{1,2}[n|N][o|O][l|L][o|O][g|G])$/.test(val))
      noLogging = true;

   prearg = val;
})
//console.log(`PORT# is ${PORT}`);
////////////////////////////////////////////////////

////////////////////////////////////////////////////
// Logging
function logging(stream) {
   if (noLogging)
      return;

   const line = 'logged at ' + new Date() + ': ' + stream + '\n';
   fs.appendFile("ooth.log", line, function(err) {
      if (err)
         console.log(err);
   });
}
//////////////////////////////////////////////////

//////////////////////////////////////////////////
// This event will be triggered after the ooth login process
const onAfterOothLogin = function(user) {
   // The balance of the user account
   user.local.balance = linkgearPOS.balanceOf(user.local.account);

   //console.log(`user profile: ${JSON.stringify(user)}`);
}
/////////////////////////////////////////////////

const start = async () => {
    try {
        const client = await MongoClient.connect(qadb? MONGO_HOST_QA: MONGO_HOST_LOCAL)
        const db = client.db(MONGO_DB)
        console.log(`Start ${qadb? MONGO_HOST_QA: MONGO_HOST_LOCAL}`);

        const app = express()
        var corsOptions = {
           origin: /linkcryptocoin\.com*|linkgear\.net*/,
           credentials: true
        }
        if (nocors) {
           corsOptions.origin = true
        }
           
        //app.use(cors())
        app.use(cors(corsOptions))
        console.log(`cors checking mode: ${!nocors}`);

        app.use(session({
            name: 'api-session-id',
            secret: SECRET,
            resave: false,
            saveUninitialized: true,
        }))

        // LinkgearPOS mongodb instance
        linkgearPOS.setMongoDbo(db);

        const ooth = new Ooth({
            sharedSecret: SHARED_SECRET,
            path: OOTH_PATH,
            onLogin: onAfterOothLogin,
        })
        const oothMongo = new OothMongo(db, ObjectId)
        await ooth.start(app, oothMongo)
        ooth.use('local', oothLocal({
            onRegister({email, verificationToken, _id}) {
                console.log(`${email}/${_id} registered`)
                logging(`${email}/${_id} registered`)
            },
            onGenerateVerificationToken({email, verificationToken}) {
                //console.log(`${email} requested a verification ${verificationToken}.`)
                //logging(`${email} requested a verification ${verificationToken}.`)
            },
            onVerify({email, _id}) {
                //console.log(`${_id} verified a generate-verification token`)
                //logging(`${_id} verified a generate-verification token`)
            },
            onForgotPassword({email, passwordResetToken, _id}) {
                console.log(`${email}/${_id} forgot its password, here is the token: ${passwordResetToken}`)
                logging(`${email}/${_id} forgot its password, here is the token: ${passwordResetToken}`)
            },
            onResetPassword({email}) {
                console.log(`${email} reset its password`)
                logging(`${email} reset its password`)
            },
            onLinkAccount({email, account}) {
                console.log(`${email} links account ${account}`)
                logging(`${email} links account ${account}`)
            },
            onChangePassword({email}) {
                console.log(`${email} changed its password`)
                logging(`${email} changed its password`)
            },
         }), function(req, res,next) {
                console.log(`Request type: ${req.type}`)
                next();
        })

        console.log(`${__dirname}/index.html`);
        app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`))
        
        if (httpsRun) {
            const server = https.createServer({
                         key: fs.readFileSync('keys/key.pem'),
                         cert: fs.readFileSync('keys/cert.pem'),
                         }, app)

             await new Promise(resolve => server.listen(PORT, resolve));
             console.log(`Online at ${HOST_LOCAL}:${PORT}`);
        } else { 
             await promisify(app.listen)(PORT) 
             console.log(`Online at ${HOST_LOCALN}:${PORT}`);
        }
    } catch (e) {
        console.error(e)
    }
}

start()
