'use strict';

var Q             = require('q'),
    url           = require('url'),
    SecureRequest = require('../request/secure-request');

/**
 * @constructor
 */
function RestoreBackup () {
    this.data = null;
}

/**
 * Set send data
 * @param {Object|string} data - Data to be send
 * @returns {CreateAction}
 */
RestoreBackup.prototype.setData = function (data) {
    this.data = data;

    return this;
};

/**
 * Send restore backup request
 * @param {Object} server - farmer server specification
 * @returns {*|promise}
 */
RestoreBackup.prototype.executeOn = function (server) {
    var deferred = Q.defer(),
        secureReq = new SecureRequest(),
        opt = {
            uri: url.resolve(server.api, '/api/container/greenhouse/backup/restore'),
            method: 'POST',
            json: this.data
        };

    secureReq.send(opt, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        } else {
            if (body) {
                deferred.reject(body.error);
            } else {
                deferred.reject(error);
            }
        }
    });

    return deferred.promise;
};

module.exports = new RestoreBackup();
