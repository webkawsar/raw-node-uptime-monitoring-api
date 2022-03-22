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
    twilio: {
        fromPhone: '+17626752177',
        accountSid: 'ACcafd46781a4deb8fccc0f1e2e5e97c7e',
        authToken: 'f67d03d816e43648ded5dab9bbf1132b',
    },
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'I love vanila JS',
    maxCheck: 5,
    twilio: {
        fromPhone: '+17626752177',
        accountSid: 'ACcafd46781a4deb8fccc0f1e2e5e97c7e',
        authToken: 'f67d03d816e43648ded5dab9bbf1132b',
    },
};

// determine which environment was passed
const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// Export corresponding object
const env = environments[currentEnv];
const environmentToExport = typeof env === 'object' ? env : environments.staging;

module.exports = environmentToExport;
