/*
 * Title: Uptime Monitoring API workers file
 * Description: A restful Api
 * Author: Kawsar Ahmed
 * Date: 22/03/2022
 *
 */

// dependencies
const url = require('url');
const http = require('http');
const https = require('https');
const data = require('./data');
const { parseJSON } = require('../helpers/utilities');
const { sendTwilioSms } = require('../helpers/notifications');

// Worker Object - Module Scaffolding
const worker = {};

worker.alertUserToStatusChange = (newCheck) => {
    const msg = `Alert: Your check for ${newCheck.method.toLowerCase()} ${newCheck.protocol}://${
        newCheck.url
    } is currently ${newCheck.state}`;
    sendTwilioSms(newCheck.userPhone, msg, (error) => {
        if (!error) {
            console.log(`User was alerted to status change via SMS: ${msg}`);
        } else {
            console.log('There was a problem sending sms to one of the user');
        }
    });
};

worker.processCheckOutcome = (check, checkOutCome) => {
    const isIncludeCode = check.successCodes.includes(checkOutCome.respondCode);
    const state = !checkOutCome.error && checkOutCome.respondCode && isIncludeCode ? 'up' : 'down';

    const alertWanted = !!(check.lastChecked && check.state !== state);
    const newCheck = check;
    newCheck.state = state;
    newCheck.lastChecked = Date.now();

    // update the check
    data.update('checks', check.id, newCheck, (error) => {
        if (!error) {
            if (alertWanted) {
                // send the check data to next process
                worker.alertUserToStatusChange(newCheck);
            } else {
                console.log('Alert is not needed as there is no state change');
            }
        } else {
            console.log('Error: trying to save check data of one of the checks');
        }
    });
};

worker.performCheck = (check) => {
    // prepare the initial outcome
    let checkOutCome = {
        error: false,
        value: false,
    };
    // mark the outcome has not been send yet
    let outComeSent = false;

    // parse url
    const parsedURL = url.parse(`${check.protocol}://${check.url}`, true);
    const { hostname } = parsedURL;
    const { path } = parsedURL;

    const requestDetails = {
        protocol: `${check.protocol}:`,
        hostname,
        method: check.method.toUpperCase(),
        path,
        timeout: check.timeoutSeconds * 1000,
    };

    const protocol = check.protocol === 'http' ? http : https;
    const req = protocol.request(requestDetails, (res) => {
        // get the status of sent req
        const status = res.statusCode;

        // update the check outcome and next step
        checkOutCome.respondCode = status;
        if (!outComeSent) {
            worker.processCheckOutcome(check, checkOutCome);
            outComeSent = true;
        }
    });

    req.on('error', (e) => {
        checkOutCome = {
            error: true,
            value: e,
        };
        if (!outComeSent) {
            worker.processCheckOutcome(check, checkOutCome);
            outComeSent = true;
        }
    });

    req.on('timeout', () => {
        checkOutCome = {
            error: true,
            value: 'timeout',
        };
        if (!outComeSent) {
            worker.processCheckOutcome(check, checkOutCome);
            outComeSent = true;
        }
    });
    req.end();
};

// Check validate function
worker.validateCheckData = (checkData) => {
    if (checkData && checkData.id) {
        const check = checkData;

        const typeofState = typeof check.state === 'string';
        const isState = ['up', 'down'].includes(check.state);
        const state = typeofState && isState ? check.state : 'down';

        const typeofLastCheck = typeof check.lastChecked === 'number';
        const lastChecked = typeofLastCheck && check.lastChecked > 0 ? check.lastChecked : false;

        check.state = state;
        check.lastChecked = lastChecked;

        // process to next step
        worker.performCheck(check);
    } else {
        console.log('Error: Check was invalid or not formated');
    }
};

// lookup all the checks
worker.gatherAllChecks = () => {
    // get all the checks
    data.list('checks', (error, checks) => {
        if (!error && checks.length > 0) {
            checks.forEach((check) => {
                // read the check data
                data.read('checks', check, (error2, checkData) => {
                    if (!error2 && checkData) {
                        // pass the data to check validate
                        worker.validateCheckData(parseJSON(checkData));
                    } else {
                        console.log("Error: Can't read check data");
                    }
                });
            });
        } else {
            console.log("Error: couldn't find any checks to process");
        }
    });
};

// execute loop after per minutes
worker.loop = () => {
    setInterval(() => {
        worker.gatherAllChecks();
    }, 8000);
};

// Start the workers
worker.init = () => {
    // Execute all the checks
    worker.gatherAllChecks();

    // call the loop so that checks continue
    worker.loop();
};

// export
module.exports = worker;
