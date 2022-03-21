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
    maxCheck: 5,
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'I love vanila JS',
    maxCheck: 5,
};

// determine which environment was passed
const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// Export corresponding object
const env = environments[currentEnv];
const environmentToExport = typeof env === 'object' ? env : environments.staging;

module.exports = environmentToExport;
