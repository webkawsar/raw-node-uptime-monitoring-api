/*
 * Title: Handle Request response
 * Description: Handle req and res
 * Author: Kawsar Ahmed
 * Date: 17/03/2022
 *
 */

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');

// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    // Request Handle
    const pursedUrl = url.parse(req.url, true);
    const path = pursedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = pursedUrl.query;
    const headerObject = req.headers;

    const requestProperties = {
        pursedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headerObject,
    };

    const choosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
    // console.log(typeof choosenHandler, 'choosenHandler');

    const decoder = new StringDecoder('utf8');
    let realData = '';

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);

        choosenHandler(requestProperties, (code, obj) => {
            const statusCode = typeof code === 'number' ? code : 500;
            const payLoad = typeof obj === 'object' ? obj : {};
            const payLoadString = JSON.stringify(payLoad);

            // return final response
            res.writeHead(statusCode);
            res.end(payLoadString);
        });
        // res.end('Hello Nodejs Developer!');
    });
};

module.exports = handler;
