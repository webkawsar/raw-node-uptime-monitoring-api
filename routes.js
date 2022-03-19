/*
 * Title: Routes
 * Description: Application routes
 * Author: Kawsar Ahmed
 * Date: 17/03/2022
 *
 */

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

// Module Scaffolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
};

module.exports = routes;
