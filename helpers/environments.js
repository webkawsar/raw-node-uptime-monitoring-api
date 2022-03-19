/*
 * Title: Enviroment
 * Description: Handle all environment
 * Author: Kawsar Ahmed
 * Date: 18/03/2022
 *
 */

// Dependencies
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'I love vanila JS',
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'I love vanila JS',
};

// determine which environment was passed
const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// Export corresponding object
const environmentToExport =    typeof environments[currentEnv] === 'object' ? environments[currentEnv] : environments.staging;

module.exports = environmentToExport;
