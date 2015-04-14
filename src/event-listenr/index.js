'use strict';

var Q = require('q'),
    io = require('socket.io-client');


function Listener (stationServer, room) {
    console.log('constructor');
    this.serverUrl = stationServer + '/' + room;
    this.socket = null;
    console.log('this.socket', this.socket);
}

Listener.prototype.connect = function () {
    this.socket = io.connect(this.serverUrl, {reconnect: true});

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

    this.socket.on('reconnect', function () {
        console.log('reconnect');
    });

    return deferred.promise;
};

Listener.prototype.listen = function () {
    console.log('>>>>>>>>>> listen');
    this.socket.on('connect', function() {
        console.log('>>>>>>>>>> listener connected');
        this.socket.on('event', function (data) {
            console.log('>>>>>>>>>> client receive data', data);
        });
    });
};

module.exports = Listener;
