'use strict';

var Q             = require('q'),
    url           = require('url'),
    SecureRequest = require('../request/secure-request');

/**
 * @constructor
 */
function ListAction () {

}

/**
 * Get list request to farmer server
 * @param {Object} server - farmer server specification
 * @returns {*|promise}
 */
ListAction.prototype.executeOn = function (server) {
    var deferred = Q.defer(),
        secureReq = new SecureRequest(),
        opt = {
            uri: url.resolve(server.api, '/api/container/list'),
            method: 'GET'
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

module.exports = new ListAction();
