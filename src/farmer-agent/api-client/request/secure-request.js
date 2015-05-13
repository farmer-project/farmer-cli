'use strict';

var _       = require('lodash'),
    Q       = require('q'),
    request = require('request'),
    AES     = require('./crypto/aes'),
    File    = require('../../../file'),
    config  = require('../../../../toolbelt.conf');

function SecureRequest () {
    this.aes = new AES();
}

/**
 *
 * @param {Object} opt - Request options
 * @param {Function} callback - Callback function with three variable 'error', 'response' and 'body'
 */
SecureRequest.prototype.send = function (opt, callback) {
    var self = this,
        file = new File();

    //if (!opt['json']) {
    //    throw new Error('data is empty; secure request is not require');
    //} else {
    //    self.aes.newKey(config.username, file.setPath(config.private_key).readSync()).then(function (key) {
    //        console.log('key >>>>', key);
    //        var encryptData = self.aes.encrypt(JSON.stringify(opt.json), key);
    //        opt['json'] = {
    //            username: config.username,
    //            data: encryptData
    //        };
    console.log('opt request >>>>>>>>>>>>>>', require('util').inspect(opt, false, null));

    self.request(opt).spread(callback);
        //});
    //}
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
