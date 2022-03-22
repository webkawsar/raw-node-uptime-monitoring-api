/*
 * Title: Notifications Helper
 * Description: Notification function help send tnotification to user
 * Author: Kawsar Ahmed
 * Date: 22/03/2022
 *
 */
// dependencies
const https = require('https');
const { twilio } = require('./environments');

// module scaffolding
const notifications = {};
notifications.sendTwilioSms = (phone, msg, callback) => {
    // validate input
    const typeofPhone = typeof phone === 'string';
    const userPhone = typeofPhone && phone.trim().length === 11 ? phone.trim() : false;

    const typeofMsg = typeof msg === 'string';
    const msgLength = msg.trim().length;
    const userMsg = typeofMsg && msgLength > 0 && msgLength < 1600 ? msg.trim() : false;

    if (userPhone && userMsg) {
        // configure the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg,
        };

        // stringify the payload
        const stringifyPayload = JSON.stringify(payload);

        // configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'GET',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status of sent req
            const status = res.statusCode;
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(stringifyPayload);
        req.end();
    } else {
        callback('Given parameter missing or invalid');
    }
};

module.exports = notifications;
