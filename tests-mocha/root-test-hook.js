const app = require('../server');
module.exports.mochaHooks = {
    beforeAll(done) {
        // if a very long environment setup is needed ...
        // this.timeout(5000);
        app.on('server-up-and-running', () => {
            console.log('Start event received: now executing all tests ...');
            done();
        });
    }
}