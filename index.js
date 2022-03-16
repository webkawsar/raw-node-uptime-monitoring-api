/*
 * Title: Uptime Monitoring API
 * Description: A restful Api
 * Author: Kawsar Ahmed
 * Date: 16/03/2022
 *
 */

// dependencies
const http = require('http');

// App Object - Module Scaffolding
const app = {};

// App Configuration
app.config = {
    port: 3000,
};

// Create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`Server is listening on port: ${app.config.port}`);
    });
};

// Handle Request Response
app.handleReqRes = (req, res) => {
    // Response handle
    res.end('Hello Nodejs Programmer!');
};

// Call Server
app.createServer();
