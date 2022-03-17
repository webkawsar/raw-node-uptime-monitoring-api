/*
 * Title: Sample Handler
 * Description: Routes sample handler
 * Author: Kawsar Ahmed
 * Date: 17/03/2022
 *
 */

// Module Scaffolding
const handler = {};

// Handler
handler.sampleHandler = (requestProperties, callback) => {
    // console.log(requestProperties);
    callback(200, {
        message: 'Sample url',
    });
};

module.exports = handler;
