/*
 * Title: Uptime Monitoring API server file
 * Description: A restful Api
 * Author: Kawsar Ahmed
 * Date: 16/03/2022
 *
 */

// dependencies
const http = require('http');

const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');
// const data = require('./lib/data');

// App Object - Module Scaffolding
const server = {};

// Create Server
server.createServer = () => {
    const app = http.createServer(server.handleReqRes);
    app.listen(environment.port, () => {
        console.log(`Server is listening on port: ${environment.port}`);
    });
};

// Handle Request Response
server.handleReqRes = handleReqRes;

// Start the Server
server.init = () => {
    server.createServer();
};

// export
module.exports = server;
