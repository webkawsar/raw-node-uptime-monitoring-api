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

utilities.createRandomString = (strLenth) => {
    // let length = strLenth;
    const length = typeof strLenth === 'number' && strLenth > 0 ? strLenth : false;
    if (length) {
        const possibleChar = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        for (let i = 0; i < length; i += 1) {
            output += possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
        }

        return output;
    }
    return false;
};

module.exports = utilities;
