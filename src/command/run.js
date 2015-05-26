'use strict';

var Q               = require('q'),
    path            = require('path'),
    Terminal        = require('../terminal'),
    Listener        = require('../event-listenr'),
    agent           = require('../farmer-agent'),
    dataResolver    = require('../farmer-agent/dataResolver'),
    config          = require(path.resolve(__dirname, '../config'));

/**
 * @param {Object} program - Commander object
 * @constructor
 */
function Deploy(program) {
    this.program = program;
    this.init();
}

/**
 * Initialize Commander object for run command
 */
Deploy.prototype.init = function () {
    var self = this;

    this.program
        .command('run <tag/yaml/shellCommand> <hostname> ')
        .description('Run extera shell commands on container or containers')
        .action(function (commands, hostname) {
            self.action(commands, hostname);
        });
};

/**
 * Deploy command action definition
 * @param {string} hostname - First command value without tag
 * @param {string} commands - Farmer file tag or yml file address
 */
Deploy.prototype.action = function(commands, hostname) {
    try {
        var data = dataResolver.runOnSeed(hostname, commands);

        agent.runOnSeed(data).then(function (res) {
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
    } catch (e) {
        console.log(e.toString());
    }
};

module.exports = function (program) {
    return new Deploy(program);
};
