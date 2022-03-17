/*
 * Title: Not Found Handler
 * Description: 404 not found handler
 * Author: Kawsar Ahmed
 * Date: 17/03/2022
 *
 */

// Module Scaffolding
const handler = {};

// Handler
handler.notFoundHandler = (requestProperties, callback) => {
    // console.log(requestProperties);
    callback(404, {
        message: 'Not found url',
    });
};

module.exports = handler;
