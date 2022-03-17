/*
 * Title: Routes
 * Description: Application routes
 * Author: Kawsar Ahmed
 * Date: 17/03/2022
 *
 */

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');

// Module Scaffolding
const routes = {
    sample: sampleHandler,
};

module.exports = routes;
