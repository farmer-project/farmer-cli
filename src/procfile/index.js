'use strict';

var Q = require('q'),
    File = require('../file')
    ;

function Procfile (address) {
    this.procfile = new File(address);
    this.composeFile = null;
}

Procfile.prototype.toJson = function () {
    var self = this;

    return this._validation()
        .then(function () {
            var procfile = self.procfile.toJson();
            procfile.containers = self.getComposeFile().toJson();

            return procfile;
        });
};

Procfile.prototype._validation = function () {
    var deferred  = Q.defer();

    try {
        var procfileJSON = this.procfile.toJson();
        if (procfileJSON.containers) {
            this.getComposeFile().toJson();
            deferred.resolve();
        } else {
            deferred.reject();
        }

    } catch (e) {
        deferred.reject(e);
    }

    return deferred.promise;
};

Procfile.prototype.getComposeFile = function () {
    if ( ! this.composeFile) {
        var composeFile = this.procfile.toJson().containers;

        if (composeFile.split('/')[0] !== '') { // relative address
            var procfileAddress = this.procfile.getAddress(),
                last = procfileAddress.split('/').length - 1;

            composeFile = procfileAddress.substr(
                0, procfileAddress.length - procfileAddress.split('/')[last].length) + '/' + composeFile;
        }

        this.composeFile = new File(composeFile);
    }

    return this.composeFile;
};

module.exports = Procfile;