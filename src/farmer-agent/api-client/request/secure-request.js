'use strict';

var _       = require('lodash'),
    Q       = require('q'),
    request = require('request'),
    File    = require('../../../file'),
    config  = require('../../../config');

function SecureRequest () {
}

/**
 *
 * @param {Object} opt - Request options
 * @param {Function} callback - Callback function with three variable 'error', 'response' and 'body'
 */
SecureRequest.prototype.send = function (opt, callback) {
    this.request(opt).spread(callback);
};

/**
 * Send request and return decrypted data
 * @param {Object} option - Request options
 * @returns {*|promise}
 */
SecureRequest.prototype.request = function (option) {
    var deferred = Q.defer();

    request(option, function(error, response, body) {
        try {
            deferred.resolve([error, response, body]);//this.aes.decrypt
        } catch (e) {
            deferred.reject(e);
        }
    });

    return deferred.promise;
};

module.exports = SecureRequest;
