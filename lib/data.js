/*
 * Title: Data file
 * Description: Handle all data
 * Author: Kawsar Ahmed
 * Date: 18/03/2022
 *
 */

// Dependencies
const fs = require('fs');
const path = require('path');

// Module Scaffolding
const lib = {};

// base dir of the data folder
lib.basedir = path.join(__dirname, '../.data/');

// Write data to file
lib.create = (dir, file, data, callback) => {
    // open file for write
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (error2) => {
                if (!error2) {
                    fs.close(fileDescriptor, (error3) => {
                        if (!error3) {
                            callback(false);
                        } else {
                            callback(error3);
                        }
                    });
                } else {
                    callback(error2);
                }
            });
        } else {
            callback(error);
        }
    });
};

// Read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (error, data) => {
        callback(error, data);
    });
};
// Update data
lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            const stringData = JSON.stringify(data);

            // truncate file
            fs.truncate(fileDescriptor, (error2) => {
                if (!error2) {
                    fs.writeFile(fileDescriptor, stringData, (error3) => {
                        if (!error3) {
                            fs.close(fileDescriptor, (error4) => {
                                if (!error4) {
                                    callback(false);
                                } else {
                                    callback('Error closing file');
                                }
                            });
                        } else {
                            callback('Error writing file');
                        }
                    });
                } else {
                    callback('Error truncating file');
                }
            });
        } else {
            console.log('Error updating. File may not exist');
        }
    });
};

// Delete existing file
lib.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (error) => {
        if (!error) {
            callback(false);
        } else {
            callback('Error deleteing file');
        }
    });
};
module.exports = lib;
