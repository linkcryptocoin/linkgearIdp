const {MongoClient, ObjectId} = require('mongodb')
const express = require('express')
const session = require('express-session')
const {promisify} = require('util')
const Ooth = require('ooth')
const oothLocal = require('./ooth-local.js')
const OothMongo = require('ooth-mongo')
const https = require('https')
const fs = require('fs')
//const MONGO_HOST = 'mongodb://localhost:27017'
//const MONGO_DB = 'ooth-minimal'
//const HOST = 'https://localhost'
//const PORT = 3000
const MONGO_HOST = 'mongodb://172.31.83.105:32786'
const MONGO_DB = 'linkgear'
const HOST = 'https://172.31.83.105'
const HOSTN = 'http://172.31.83.105'
const PORT = 8091
const SECRET = 'linkgearsecret'
const SHARED_SECRET = 'linkgearsharedsecret'
const OOTH_PATH = '/auth'

const cors = require('cors')

const start = async () => {
    try {
        const client = await MongoClient.connect(MONGO_HOST)
        const db = client.db(MONGO_DB)
    
        const app = express()
        //app.use(cors())
        app.use(cors({credentials: true, origin: true}))

        app.use(session({
            name: 'api-session-id',
            secret: SECRET,
            resave: false,
            saveUninitialized: true,
        }))

        const ooth = new Ooth({
            sharedSecret: SHARED_SECRET,
            path: OOTH_PATH,
        })
        const oothMongo = new OothMongo(db, ObjectId)
        await ooth.start(app, oothMongo)
        ooth.use('local', oothLocal({
            onRegister({email, verificationToken, _id}) {
                console.log(`${email}/${_id} registered`)
            },
            onGenerateVerificationToken({email, verificationToken}) {
                console.log(`${email} requested a verification ${verificationToken}.`)
            },
            onVerify({email, _id}) {
                console.log(`${_id} verified a generate-verification token`)
            },
            onForgotPassword({email, passwordResetToken, _id}) {
                console.log(`${email}/${_id} forgot its password, here is the token: ${passwordResetToken}`)
            },
            onResetPassword({email}) {
                console.log(`${email} reset its password`)
            },
            onChangePassword({email}) {
                console.log(`${email} changed its password`)
            },
         }), function(req, res,next) {
                console.log(`Request type: ${req.type}`)
                next();
        })

        console.log(`${__dirname}/index.html`);
        app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`))
        
        if (false) {
            const server = https.createServer({
                         key: fs.readFileSync('keys/key.pem'),
                         cert: fs.readFileSync('keys/cert.pem'),
                         }, app)

             await new Promise(resolve => server.listen(PORT, resolve));
             console.info(`Online at ${HOST}:${PORT}`);
        } else { 
             await promisify(app.listen)(PORT) 
             console.info(`Online at ${HOSTN}:${PORT}`);
        }
    } catch (e) {
        console.error(e)
    }
}

start()
