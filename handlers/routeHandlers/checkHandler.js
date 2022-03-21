/* eslint-disable max-len */
/*
 * Title: Check Handler
 * Description: Routes handle check
 * Author: Kawsar Ahmed
 * Date: 20/03/2022
 *
 */

// Dependencies
const data = require('../../lib/data');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxCheck } = require('../../helpers/environments');

// Module Scaffolding
const handler = {};

// Handler
handler.checkHandler = (requestProperties, callback) => {
    const acceptedmethods = ['get', 'post', 'put', 'delete'];

    if (acceptedmethods.includes(requestProperties.method)) {
        // Call the method
        handler.check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, { error: 'Request method not allowed' });
    }
};
handler.check = {};
handler.check.post = (requestProperties, callback) => {
    // validate inputs
    const valueOfProtocol = requestProperties.body.protocol;
    const position = ['http', 'https'].indexOf(requestProperties.body.protocol);
    const protocol = typeof valueOfProtocol === 'string' && position > -1 ? valueOfProtocol : false;

    const valueOfUrl = requestProperties.body.url;
    const lengthOfUrl = requestProperties.body.url?.trim().length;
    const url = typeof valueOfUrl === 'string' && lengthOfUrl > 0 ? valueOfUrl : false;

    const valueOfMethod = requestProperties.body.method;
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    const isAllowMethod = acceptedMethods.includes(requestProperties.method);
    const method = typeof valueOfMethod === 'string' && isAllowMethod ? valueOfMethod : false;

    const success = requestProperties.body.successCodes;
    const successCodes = typeof success === 'object' && success instanceof Array ? success : false;

    const value = requestProperties.body.timeoutSeconds;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line prettier/prettier
    const timeoutSeconds = typeof value === 'number' && value % 1 === 0 && value > 1 && value < 5 ? value : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        const tokenId = requestProperties.headerObject.token;
        const token = typeof tokenId === 'string' ? tokenId : false;

        // find the phone number by token then verify token
        data.read('tokens', token, (error, tokenData) => {
            if (!error && tokenData) {
                const { phone } = parseJSON(tokenData);
                // find the user
                data.read('users', phone, (error2, userData) => {
                    if (!error2 && userData) {
                        // Verify token
                        tokenHandler.token.verify(token, phone, (isAllowed) => {
                            if (isAllowed) {
                                const userObject = parseJSON(userData);
                                // eslint-disable-next-line max-len
                                // eslint-disable-next-line prettier/prettier
                                const userChecks = userObject.checks instanceof Array ? userObject.checks : [];

                                if (userChecks.length < maxCheck) {
                                    const id = createRandomString(20);
                                    const checkObject = {
                                        id,
                                        userPhone: phone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSeconds,
                                    };

                                    // save the object
                                    data.create('checks', id, checkObject, (error3) => {
                                        if (!error3) {
                                            // add check id to user object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(id);

                                            // save the new updated data
                                            data.update('users', phone, userObject, (error4) => {
                                                if (!error4) {
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error: 'There was a server side error!',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'There was a server side error!',
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error: 'User already reached max check limit!',
                                    });
                                }
                            } else {
                                callback(403, { error: 'Authentication failed!' });
                            }
                        });
                    } else {
                        callback(404, { error: 'User not found!' });
                    }
                });
            } else {
                callback(403, { error: 'Authentication failed!' });
            }
        });
    } else {
        callback(400, { error: 'There was a problem in your request' });
    }
};

handler.check.get = (requestProperties, callback) => {
    // check the token if valid
    const typeofId = typeof requestProperties.queryStringObject.id === 'string';
    const idLength = requestProperties.queryStringObject.id?.trim().length;
    const id = typeofId && idLength === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {
        // lookup the check
        data.read('checks', id, (error, checkData) => {
            if (!error && checkData) {
                // Verify token
                const check = parseJSON(checkData);
                const tokenId = requestProperties.headerObject.token;
                const token = typeof tokenId === 'string' ? tokenId : false;

                tokenHandler.token.verify(token, check.userPhone, (isAllowed) => {
                    if (isAllowed) {
                        callback(200, check);
                    } else {
                        callback(403, { error: 'Authentication failed!' });
                    }
                });
            } else {
                callback(500, { error: 'There was a problem in server side!' });
            }
        });
    } else {
        callback(400, { error: 'There was a problem in your request' });
    }
};

handler.check.put = (requestProperties, callback) => {
    // check the token if valid
    const typeofId = typeof requestProperties.body.id === 'string';
    const idLength = requestProperties.body.id?.trim().length;
    const id = typeofId && idLength === 20 ? requestProperties.body.id : false;

    // validate inputs
    const valueOfProtocol = requestProperties.body.protocol;
    const position = ['http', 'https'].indexOf(requestProperties.body.protocol);
    const protocol = typeof valueOfProtocol === 'string' && position > -1 ? valueOfProtocol : false;

    const valueOfUrl = requestProperties.body.url;
    const lengthOfUrl = requestProperties.body.url?.trim().length;
    const url = typeof valueOfUrl === 'string' && lengthOfUrl > 0 ? valueOfUrl : false;

    const valueOfMethod = requestProperties.body.method;
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    const isAllowMethod = acceptedMethods.includes(requestProperties.method);
    const method = typeof valueOfMethod === 'string' && isAllowMethod ? valueOfMethod : false;

    const success = requestProperties.body.successCodes;
    const successCodes = typeof success === 'object' && success instanceof Array ? success : false;

    const value = requestProperties.body.timeoutSeconds;
    // eslint-disable-next-line max-len
    // eslint-disable-next-line prettier/prettier
    const timeoutSeconds = typeof value === 'number' && value % 1 === 0 && value > 1 && value < 5 ? value : false;

    if (id) {
        if (protocol || url || method || successCodes || timeoutSeconds) {
            data.read('checks', id, (error, checkData) => {
                if (!error && checkData) {
                    // Verify token
                    const check = parseJSON(checkData);
                    const tokenId = requestProperties.headerObject.token;
                    const token = typeof tokenId === 'string' ? tokenId : false;

                    tokenHandler.token.verify(token, check.userPhone, (isAllowed) => {
                        if (isAllowed) {
                            // callback(200, check);
                            if (protocol) {
                                check.protocol = protocol;
                            }
                            if (url) {
                                check.url = url;
                            }
                            if (method) {
                                check.method = method;
                            }
                            if (successCodes) {
                                check.successCodes = successCodes;
                            }
                            if (timeoutSeconds) {
                                check.timeoutSeconds = timeoutSeconds;
                            }

                            // store the check object
                            data.update('checks', id, check, (error2) => {
                                if (!error2) {
                                    callback(200, { message: 'Check updated successfully' });
                                } else {
                                    callback(500, { error: 'There was a problem in server side!' });
                                }
                            });
                        } else {
                            callback(403, { error: 'Authentication failed!' });
                        }
                    });
                } else {
                    callback(500, { error: 'There was a problem in server side!' });
                }
            });
        } else {
            callback(400, { error: 'You must provide at least one field to update' });
        }
    } else {
        callback(400, { error: 'There was a problem in your request' });
    }
};

handler.check.delete = (requestProperties, callback) => {
    // check the token if valid
    const typeofId = typeof requestProperties.queryStringObject.id === 'string';
    const idLength = requestProperties.queryStringObject.id?.trim().length;
    const id = typeofId && idLength === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {
        // lookup the check
        data.read('checks', id, (error, checkData) => {
            if (!error && checkData) {
                // Verify token
                const check = parseJSON(checkData);
                const tokenId = requestProperties.headerObject.token;
                const token = typeof tokenId === 'string' ? tokenId : false;

                tokenHandler.token.verify(token, check.userPhone, (isAllowed) => {
                    if (isAllowed) {
                        // delete the check data
                        data.delete('checks', id, (error2) => {
                            if (!error2) {
                                data.read('users', check.userPhone, (error3, userData) => {
                                    if (!error3 && userData) {
                                        const userObject = parseJSON(userData);

                                        // find the remove check id form user check list
                                        const userChecks = userObject.checks;
                                        const position = userChecks.indexOf(id);
                                        if (position > -1) {
                                            userChecks.splice(position, 1);
                                            // resave the user data
                                            userObject.checks = userChecks;
                                            data.update(
                                                'users',
                                                check.userPhone,
                                                userObject,
                                                (error4) => {
                                                    if (!error4) {
                                                        callback(200, {
                                                            error: 'Check deleted successfully;',
                                                        });
                                                    } else {
                                                        callback(500, {
                                                            error: 'There was a problem in server side!',
                                                        });
                                                    }
                                                    // eslint-disable-next-line comma-dangle
                                                }
                                            );
                                        } else {
                                            callback(500, {
                                                error: "Check id doesn't exist! these you are trying to remove",
                                            });
                                        }
                                    } else {
                                        callback(500, {
                                            error: 'There was a problem in server side!',
                                        });
                                    }
                                });
                            } else {
                                callback(500, { error: 'There was a problem in server side!' });
                            }
                        });
                    } else {
                        callback(403, { error: 'Authentication failed!' });
                    }
                });
            } else {
                callback(500, { error: 'There was a problem in server side!' });
            }
        });
    } else {
        callback(400, { error: 'There was a problem in your request' });
    }
};

module.exports = handler;
