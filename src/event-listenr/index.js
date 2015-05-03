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
        console.log('error:', error);
    });

    return deferred.promise;
};

Listener.prototype.listen = function (callback) {
    if (this.socket) {
        this.socket.on('event', function (data) {
            callback(data);
        });
    }
};

Listener.prototype.disconnect = function () {
    this.socket.disconnect();
};

module.exports = Listener;
