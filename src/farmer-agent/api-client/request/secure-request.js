'use strict';

var _       = require('lodash'),
    request = require('request'),
    AES     = require('./crypto/aes'),
    File    = require('../../../file'),
    config  = require('../../../../toolbelt.conf');

function SecureRequest () {
    this.aes = new AES();
    this.callback = function () {};
}

/**
 *
 * @param opt 'request' npm package options
 * @param callback function
 */
SecureRequest.prototype.send = function (opt, callback) {
    this.callback = callback;
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
            request(opt, self._receive);
        //});
    //}
};

/**
 *
 * @param error 'request' npm error
 * @param response 'request' npm response
 * @param body 'request' npm response body
 * @private
 */
SecureRequest.prototype._receive = function (error, response, body) {
    try {
        console.log('error', error);
        console.log('body', body);
        this.callback(error, response, /*this.aes.decrypt(*/body/*)*/);
    } catch (e) {
        console.log('error', e);
    }
};

module.exports = SecureRequest;
