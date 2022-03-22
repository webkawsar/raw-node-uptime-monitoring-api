/*
 * Title: Uptime Monitoring API
 * Description: A restful Api
 * Author: Kawsar Ahmed
 * Date: 16/03/2022
 *
 */

// dependencies
const http = require('http');
const { sendTwilioSms } = require('./helpers/notifications');

const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
// const data = require('./lib/data');

// App Object - Module Scaffolding
const app = {};

// testing file system
sendTwilioSms('01733920943', 'Hello bhai', (error) => {
    console.log(`sendTwilioSms error was: ${error}`);
});

// Create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`Server is listening on port: ${environment.port}`);
    });
};

// Handle Request Response
app.handleReqRes = handleReqRes;

// Start the Server
app.createServer();
