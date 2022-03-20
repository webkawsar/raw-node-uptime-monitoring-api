/*
 * Title: Token Handler
 * Description: Routes handle token
 * Author: Kawsar Ahmed
 * Date: 20/03/2022
 *
 */

// Dependencies
const data = require('../../lib/data');
const { hash, parseJSON, createRandomString } = require('../../helpers/utilities');

// Module Scaffolding
const handler = {};

// Handler
handler.tokenHandler = (requestProperties, callback) => {
    const acceptedmethods = ['get', 'post', 'put', 'delete'];

    if (acceptedmethods.includes(requestProperties.method)) {
        // Call the method
        handler.token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, { error: 'Request method not allowed' });
    }
};
handler.token = {};
handler.token.post = (requestProperties, callback) => {
    const typeofPhone = typeof requestProperties.body.phone === 'string';
    const phoneLength = requestProperties.body.phone.trim().length;
    const phone = typeofPhone && phoneLength === 11 ? requestProperties.body.phone : false;

    const typeofPassword = typeof requestProperties.body.password === 'string';
    const passwordLength = requestProperties.body.password.trim().length;
    const password = typeofPassword && passwordLength > 0 ? requestProperties.body.password : false;

    if (phone && password) {
        data.read('users', phone, (error, uData) => {
            const hashedPassword = hash(password);
            const userData = parseJSON(uData);
            if (hashedPassword === userData.password) {
                const tokenId = createRandomString(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = { phone, id: tokenId, expires };

                // STore the token
                data.create('tokens', tokenId, tokenObject, (error2) => {
                    if (!error2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'Phone or Password invalid',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

handler.token.get = (requestProperties, callback) => {
    // check the token if valid
    const typeofId = typeof requestProperties.queryStringObject.id === 'string';
    const idLength = requestProperties.queryStringObject.id?.trim().length;
    const id = typeofId && idLength === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {
        data.read('tokens', id, (error, token) => {
            if (!error && token) {
                callback(200, { ...parseJSON(token) });
            } else {
                callback(404, { error: 'Requested token was not found' });
            }
        });
    } else {
        callback(404, { error: 'Requested token was not found' });
    }
};

handler.token.put = (requestProperties, callback) => {
    const typeofId = typeof requestProperties.body.id === 'string';
    const idLength = requestProperties.body.id.trim().length;
    const id = typeofId && idLength === 20 ? requestProperties.body.id : false;

    const bool = typeof requestProperties.body.extend === 'boolean';
    const boolTrue = requestProperties.body.extend === true;
    const extend = !!(bool && boolTrue);
    if (id && extend) {
        data.read('tokens', id, (error, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                // Store the updated token data
                data.update('tokens', id, tokenObject, (error2) => {
                    if (!error2) {
                        callback(200, { message: 'Successfully extend token time' });
                    } else {
                        callback(500, { error: 'There was a server side error' });
                    }
                });
            } else {
                callback(400, { error: 'Token already expired' });
            }
        });
    } else {
        callback(400, { error: 'There was a problem in your request' });
    }
};
handler.token.delete = (requestProperties, callback) => {
    const typeofId = typeof requestProperties.queryStringObject.id === 'string';
    const idLength = requestProperties.queryStringObject.id?.trim().length;
    const id = typeofId && idLength === 20 ? requestProperties.queryStringObject.id : false;
    if (id) {
        // find token
        data.read('tokens', id, (error, tokenData) => {
            if (!error && tokenData) {
                data.delete('tokens', id, (error2) => {
                    if (!error2) {
                        callback(200, {
                            message: 'Token was successfully deleted!',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side',
                        });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in the server side',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

// verify token
handler.token.verify = (id, phone, callback) => {
    data.read('tokens', id, (error, tokenData) => {
        if (!error && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};
module.exports = handler;
