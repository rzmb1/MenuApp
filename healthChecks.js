const { connection } = require('mongoose');
const { createTerminus } = require('@godaddy/terminus');
const { logger } = require('./utils/logger');


function setupHealthChecks(server) {
    const terminusOptions = {
        signal: 'SIGINT',
        beforeShutdown: () => {
            logger.info('Server - Stopping with grace period of 5 secs');
            return new Promise(resolve => {
                setTimeout(resolve, 5000);
            });
        },
        onSignal
    };

    return createTerminus(server, terminusOptions);
}

function onSignal() {
    return new Promise(resolve => {
        connection.close().then(() => resolve());
    });
}

module.exports = setupHealthChecks;