'use strict';

var Q   = require('q'),
    io  = require('socket.io-client');

function Listener (stationServer, room) {
    this.serverUrl = stationServer + '/' + room;
    this.socket = null;
}

/**
 * Try to connect to station
 * @returns {*}
 */
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

/**
 * Listen on station event
 * @param {function} callback - callback function that run with received data
 */
Listener.prototype.listen = function (callback) {
    if (this.socket) {
        this.socket.on('event', function (data) {
            callback(data);
        });
    }
};

/**
 * Disconnect from station server
 */
Listener.prototype.disconnect = function () {
    this.socket.disconnect();
};

module.exports = Listener;
