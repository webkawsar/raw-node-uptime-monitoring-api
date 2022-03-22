/*
 * Title: Uptime Monitoring API
 * Description: Initial file to start the server and worker
 * Author: Kawsar Ahmed
 * Date: 22/03/2022
 *
 */

// dependencies
const server = require('./lib/server');
const worker = require('./lib/worker');

// App Object - Module Scaffolding
const app = {};

// server init
app.init = () => {
    // start the server
    server.init();

    // start the worker
    worker.init();
};

// Invoke function
app.init();
