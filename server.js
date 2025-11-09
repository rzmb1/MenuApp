'use strict';
const express = require('express');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const usersRouter = require('./users/usersRouter');
const menuPlansRouter = require('./menuplans/menuplanRouter');
const pollRouter = require('./polls/pollRouter');
const voteRouter = require('./votes/voteRouter');
const imageRouter = require('./images/imageRouter');
const notificationsRouter = require('./notifications/notificationsRouter');
const signupRouter = require('./signups/signupRouter');
const {errorHandler} = require('./errors/error-handler');
//const { NotFound } = require('./errors/app-errors');
const mongoose = require('mongoose');
const logRequest = require('./middleware/logRequest');
const { logger } = require('./utils/logger');
const { loadPredictionModel } = require('./menuplans/predictionModel');
const { createValidateAccessTokenMiddleware } = require('./middleware/validateAccessToken');
const { MSAL_CONFIGURATION } = require('./utils/msalConfig');
const setupHealthChecks = require('./healthChecks');
const http = require('http');
const { connection } = require('mongoose');
const { HTTPError } = require('./errors/app-errors');

const argv = yargs(hideBin(process.argv)).argv;

const defaultConnectionString = `mongodb://127.0.0.1:27017/kantine2022`;

let connectionString = process.env.MONGODB_CONNECTION_STRING??defaultConnectionString;

const PORT = argv.port??8080;
const HOSTNAME = '0.0.0.0';
const app = express();
let server;

const JWT_DECODEONLY = process.env.JWT_DECODEONLY === "true";

async function main() {
    logger.info(`ExpressApp try to start with cli-args: ${JSON.stringify(argv)}`);
    logger.info(`ExpressApp try to connect to "${connectionString}"`);
    mongoose.connect(connectionString,{serverSelectionTimeoutMS: 10000})
        .then(() => {
            loadPredictionModel();
            logger.info(`ExpressApp connected to "${connectionString}"`);
        })
        .catch(err => {
            if(!err.message.includes("ECONNREFUSED"))logger.error(`Error when connecting to db: ${err.message}`);
            logger.error(`Found no server on ${connectionString}`);
        });
    app.use(express.json({limit: '50mb'}));

    app.use(logRequest);

    server = setupHealthChecks(http.createServer(app));

    app.use('/api/readyz',(_req,res) => {
        if(connection.readyState !== 1) throw new HTTPError(503, "Database not connected");
        res.status(200).json({status:"ok"});
    });
    app.use('/api/livez',(_req,res) => res.status(200).json({status:"ok"}));

    app.use('/api', createValidateAccessTokenMiddleware(!JWT_DECODEONLY, MSAL_CONFIGURATION.auth.tenantId, MSAL_CONFIGURATION.auth.clientId));
    app.use('/api/users', usersRouter);
    app.use('/api/menuplans', menuPlansRouter);
    app.use('/api/images', imageRouter);
    app.use('/api/notifications', notificationsRouter);
    app.use('/api/signups', signupRouter);
    app.use('/api/polls', pollRouter);
    app.use('/api/votes', voteRouter);

    app.use(express.static('_clients/react-client/build/'));
    app.use((_req,res)=>{res.sendFile('/_clients/react-client/build/index.html',{root:require('path').join(__dirname)})});

    app.use(errorHandler);
    
    listenPromisfied(server, PORT, HOSTNAME)
        .then(() => {
            logger.info(`ExpressApp running on http://${HOSTNAME}:${PORT}`);
            app.emit('server-up-and-running');
            
        });
}
function listenPromisfied(server, PORT, HOSTNAME) {
    return new Promise((resolve, _reject) => {
        server.listen(PORT, HOSTNAME, () => {
            resolve();
        });
    });
}
// call main and handle errors
main().catch(err => {
    logger.error(`ExpressApp start failed. Errordetails here:`);
    logger.error(err);
    process.exit();
});

module.exports = {app, PORT};