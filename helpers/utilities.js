/*
 * Title:
 * Description:
 * Author: Kawsar Ahmed
 * Date: 19/03/2022
 *
 */
// Dependencies
const crypto = require('crypto');
const environments = require('./environments');

// module scaffolding
const utilities = {};

utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        output = {};
    }

    return output;
};

utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};

module.exports = utilities;
