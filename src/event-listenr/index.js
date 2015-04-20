'use strict';

var Q = require('q'),
    io = require('socket.io-client');


function Listener (stationServer, room) {
    this.serverUrl = stationServer + '/' + room;
    this.socket = null;
}

Listener.prototype.connect = function () {
    this.socket = io.connect(this.serverUrl, {'connect timeout': 1000});

    if (this.socket.connected) {
        return Q.when(true);
    }

    var deferred = Q.defer();
    this.socket.on('connect', function () {
        deferred.resolve()
    });

    this.socket.on('error', function (error) {
        console.log('error', error);
    });

    return deferred.promise;
};

Listener.prototype.listen = function (callback) {
    var self= this;
    if (this.socket) {
        this.socket.on('event', function (data) {
            // check if it's not end shack
            if (data['end'] !== 'END_FLAG_UP') {
                callback(data);
            } else {
                self.socket.disconnect();
            }
        });
    }
};

module.exports = Listener;
