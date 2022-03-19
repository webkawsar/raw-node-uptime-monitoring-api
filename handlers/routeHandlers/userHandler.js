/*
 * Title: User Handler
 * Description: Routes handle user
 * Author: Kawsar Ahmed
 * Date: 18/03/2022
 *
 */

// Dependencies
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');

// Module Scaffolding
const handler = {};

// Handler
handler.userHandler = (requestProperties, callback) => {
    const acceptedmethods = ['get', 'post', 'put', 'delete'];

    if (acceptedmethods.includes(requestProperties.method)) {
        // Call the method
        handler.users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, { error: 'Request method not allowed' });
    }
};
handler.users = {};
handler.users.post = (requestProperties, callback) => {
    // Validation user data
    const typeofFirstName = typeof requestProperties.body.firstName === 'string';
    const fnameLength = requestProperties.body.firstName.trim().length;
    const firstName = typeofFirstName && fnameLength > 0 ? requestProperties.body.firstName : false;

    const typeofLastName = typeof requestProperties.body.lastName === 'string';
    const lnameLength = requestProperties.body.lastName.trim().length;
    const lastName = typeofLastName && lnameLength > 0 ? requestProperties.body.lastName : false;

    const typeofPhone = typeof requestProperties.body.phone === 'string';
    const phoneLength = requestProperties.body.phone.trim().length;
    const phone = typeofPhone && phoneLength === 11 ? requestProperties.body.phone : false;

    const typeofPassword = typeof requestProperties.body.password === 'string';
    const passwordLength = requestProperties.body.password.trim().length;
    const password = typeofPassword && passwordLength > 0 ? requestProperties.body.password : false;

    const typeofTos = typeof requestProperties.body.tosAgreement === 'boolean';
    const tosAgreement = typeofTos ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure user doesn't exist
        data.read('users', phone, (error) => {
            if (error) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };

                // store the db
                data.create('users', phone, userObject, (error2) => {
                    if (!error2) {
                        callback(200, { message: 'User was created successfully!' });
                    } else {
                        callback(500, { error: "Could't create user" });
                    }
                });
            } else {
                callback(500, {
                    error: 'User already exists!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

handler.users.get = (requestProperties, callback) => {
    // check the phone number if valid
    const typeofPhone = typeof requestProperties.queryStringObject.phone === 'string';
    const phoneLength = requestProperties.queryStringObject.phone.trim().length;
    const phone =
        typeofPhone && phoneLength === 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {
        data.read('users', phone, (error, user) => {
            if (!error && user) {
                const getUser = { ...parseJSON(user) };
                delete getUser.password;
                callback(200, getUser);
            } else {
                callback(404, { error: 'Request user was not found' });
            }
        });
    } else {
        callback(404, { error: 'Request user was not found' });
    }
};

handler.users.put = (requestProperties, callback) => {
    // Validation user data
    const typeofFirstName = typeof requestProperties.body.firstName === 'string';
    const fnameLength = requestProperties.body.firstName.trim().length;
    const firstName = typeofFirstName && fnameLength > 0 ? requestProperties.body.firstName : false;

    const typeofLastName = typeof requestProperties.body.lastName === 'string';
    const lnameLength = requestProperties.body.lastName.trim().length;
    const lastName = typeofLastName && lnameLength > 0 ? requestProperties.body.lastName : false;

    const typeofPhone = typeof requestProperties.body.phone === 'string';
    const phoneLength = requestProperties.body.phone.trim().length;
    const phone = typeofPhone && phoneLength === 11 ? requestProperties.body.phone : false;

    const typeofPassword = typeof requestProperties.body.password === 'string';
    const passwordLength = requestProperties.body.password.trim().length;
    const password = typeofPassword && passwordLength > 0 ? requestProperties.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            // findout the user
            data.read('users', phone, (error, uData) => {
                const userData = { ...parseJSON(uData) };
                if (!error && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (firstName) {
                        userData.password = hash(password);
                    }

                    // store to database
                    data.update('users', phone, userData, (error2) => {
                        if (!error2) {
                            callback(200, {
                                message: 'User was updated successfully!',
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
            });
        } else {
            callback(400, {
                error: 'You have a problem in your request',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number',
        });
    }
};
handler.users.delete = (requestProperties, callback) => {
    const typeofPhone = typeof requestProperties.queryStringObject.phone === 'string';
    const phoneLength = requestProperties.queryStringObject.phone.trim().length;
    const phone =        typeofPhone && phoneLength === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {
        // find user
        data.read('users', phone, (error, uData) => {
            if (!error && uData) {
                data.delete('users', phone, (error2) => {
                    if (!error2) {
                        callback(200, {
                            message: 'User was successfully deleted!',
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

module.exports = handler;
