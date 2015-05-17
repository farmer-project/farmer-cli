'use strict';

var Q    = require('q'),
    amqp = require('amqp');

/**
 * Create a rabbitmq subscriber
 * @param {Object} connectionOpt - Rabbitmq client config
 * @param {string} room - Room identifier
 * @constructor
 */
function Listener (connectionOpt, room) {
    this.connectionOpt = connectionOpt;
    this.roomID = room;
    this.queue = null;
    this.connection = null;
    this.consumerTag = null;
}

/**
 * Try to connect to station
 * @returns {*}
 */
Listener.prototype.connect = function () {
    var self = this,
        deferred = Q.defer(),
        connection = amqp.createConnection(this.connectionOpt, {reconnect: true});

    connection.on('ready', function () {
        console.log('connection is ready');
        self.connection = connection;
        self.connection.queue(self.roomID,
            {passive: true, durable:true}, function (queue) {
                queue.bind(self.roomID);
                console.log('connection to queue is ok');
                self.queue = queue;
                deferred.resolve(self.roomID);
        });
    });

    connection.on('close', function () {
        deferred.reject();
    });

    return deferred.promise;
};

/**
 * Listen on station event
 * @param {function} callback - callback function that run with received data
 */
Listener.prototype.listen = function (callback) {
    if (!this.connection) {
        throw new Error('connection lost');
    }

    var self = this;
    this.queue.subscribe({ack: true}, function (data) {
        console.log('go to listening');
        callback(data);
        self.queue.shift();
    }).addCallback(function (ok) {
        self.consumerTag = ok.consumerTag;
    });
};

/**
 * Disconnect from station server
 */
Listener.prototype.disconnect = function () {
    this.queue.unsubscribe(this.consumerTag);
    this.queue.destroy();
    this.connection.disconnect();
};

module.exports = Listener;
