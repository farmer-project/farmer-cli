'use strict';

var url           = require('url'),
    SecureRequest = require('../request/secure-request');

function CreateAction () {
    this.data = null;
}

CreateAction.prototype.setData = function (data) {
    this.data = data;

    return this;
};

CreateAction.prototype.executeOn = function (server) {
    var deferred = Q.defer(),
        secureReq = new SecureRequest(),
        opt = {
            uri: url.resolve(server.api, '/container/greenhouse/create'),
            method: 'POST',
            json: this.data
        };

    secureReq.send(opt, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(body);
        } else {
            // 500 – server error
            if (body) {
                deferred.reject(body.error);
            } else {
                deferred.reject(error);
            }
        }
    });

    return deferred.promise();
};

module.exports = new CreateAction();
