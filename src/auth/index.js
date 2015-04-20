var Q = require('q'),
    ursa = require('ursa'),
    fs = require('fs'),
    request = require('request'),
    config = require('../../toolbelt.conf'),
    File = require('../file');

function Auth() {

}

Auth.prototype.authorization = function () {
    var deferred = Q.defer(),
        file = new File();
    file.setPath(config.aes_key);

    if (!fs.existsSync(file.getAbsolutePath())) {
        var opt = {
            uri: config.api + '/security/getKey',
            method: 'POST',
            json: {
                "username": config.username
            }
        };

        request(opt, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // 200 – no error
                file.setPath(config.private_key);
                var privateKey  = ursa.createPrivateKey(file.readSync()),
                    aesPassword = privateKey.decrypt(new Buffer(body.result, 'base64'), 'utf8', 'base64');

                file.setPath(config.aes_key);
                file.writeSync(aesPassword);

                deferred.resolve();
            } else {
                // 500 – server error
                console.log('error: ', body.error);
                deferred.reject(body.error);
            }

        });

    } else {
        deferred.resolve();
    }

    return deferred.promise;
};

module.exports = new Auth();
