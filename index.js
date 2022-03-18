/*
 * Title: Uptime Monitoring API
 * Description: A restful Api
 * Author: Kawsar Ahmed
 * Date: 16/03/2022
 *
 */

// dependencies
const http = require('http');

const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data');

// App Object - Module Scaffolding
const app = {};

// testing file system
// data.create('test', 'newFile', { data: 'JSON Data' }, (error) => {
//     console.log('Error was: ', error);
// });

// data.read('test', 'newFile', (error, result) => {
//     console.log(error);
//     console.log(result);
// });

// data.update('test', 'newFile', { data: 'JSON Data updated' }, (error) => {
//     console.log('Error was: ', error);
// });

// data.delete('test', 'newFile', (error) => {
//     console.log(error);
// });

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
