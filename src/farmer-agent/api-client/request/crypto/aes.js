'use strict';

var Q       = require('q'),
    request = require('request'),
    ursa    = require('ursa'),
    NodeCryptojs = require('node-cryptojs-aes'),
    config  = require('../../../../../toolbelt.conf');

function AES() {

}

/**
 * Get new AES key based on username
 * @param username
 * @param rsaPrivateKey
 * @returns {*}
 */
AES.prototype.newKey = function (username, rsaPrivateKey) {
    var deferred = Q.defer(),
        opt = {
            uri: config.api + '/security/key',
            method: 'POST',
            json: {
                "username": username
            }
        };

    request(opt, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var privateKey  = ursa.createPrivateKey(rsaPrivateKey),
                key = privateKey.decrypt(new Buffer(body.result, 'base64'), 'utf8', 'base64');
            deferred.resolve(key);
        } else {
            // 500 – server error
            deferred.reject(body.error);
        }
    });

    return deferred.promise;
};

/**
 * Encrypt data based on server new AES key
 * @param string
 * @param key
 * @returns {*}
 */
AES.prototype.encrypt = function (string, key) {
    var CryptoJS = NodeCryptojs.CryptoJS,
        encrypted = CryptoJS.AES
            .encrypt(string, key, { format: NodeCryptojs.JsonFormatter });

    return encrypted.toString();
};

/**
 * Decrypt data based on AES get key
 * @param encryptData
 * @param key
 * @returns {Buffer|Object|string|Buffer|*|WordArray}
 */
AES.prototype.decrypt = function (encryptData, key) {
    var CryptoJS = NodeCryptojs.CryptoJS;
    return CryptoJS.AES
        .decrypt(encryptData, key, {format: NodeCryptojs.JsonFormatter});
};

module.exports = AES;
