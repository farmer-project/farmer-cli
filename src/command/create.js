'use strict';

var Q           = require('q'),
    shelljs     = require('shelljs'),
    path        = require('path'),
    Terminal    = require('../terminal'),
    Farmerfile  = require('../file/farmerfile'),
    Listener    = require('../event-listenr'),
    agent       = require('../farmer-agent'),
    config      = require(path.resolve(__dirname, '../config'));

/**
 * @param {Object} program - Commander object
 * @constructor
 */
function Create(program) {
    this.program = program;
    this.init();
}

/**
 * Initialize Commander object for create command
 */
Create.prototype.init = function () {
    var self = this;

    this.program
        .command('create <hostname>')
        .description('Create a stage')
        .action(function (env, options) {
            self.action(env, options);
        });
};

/**
 * Create command action definition
 * @param {string} hostname - First command value without tag
 * @param {Object} options - Commander options object
 */
Create.prototype.action = function(hostname, options) {
    var fileUri = path.join(shelljs.pwd(), config.FARMER_FILE),
        farmerFile = new Farmerfile(fileUri),
        data = {
            farmerfile: farmerFile.toJson(),
            args: {
                hostname: hostname
            }
        };

    agent.createSeed(data).then(function (res) {
        var listener = new Listener(config.STATION_SERVER, res.room),
            terminal = new Terminal();

        return listener.connect()
            .then(function () {
                var deferred = Q.defer();
                listener.listen(function (receiveData) {
                    if (!terminal.show(receiveData)) {
                        listener.disconnect();
                        return deferred.resolve(true);
                    }
                });
                return deferred.promise;
            });

    }, console.log).then(function () {
        process.exit(1);
    });
};

module.exports = function (program) {
    return new Create(program);
};
