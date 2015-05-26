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
        .command('run')
        .option('command <commandString> <package:alias>', 'Execute command on container')
        .option('yaml <fileAddress> <package:alias>', 'Execute batch of commands on container')
        .option('tag <tagName> <package>', 'Execute batch of commands on containers')
        .description('Run extera shell commands on container or containers')
        .action(function (operation, firstArg, packageDescription) {
            self.action(operation, firstArg, packageDescription);
        });
};

/**
 * Run command action definition
 * @param {string} operation - Operation
 * @param {string} firstArg - First argument
 * @param {string} packageDescription - Package description
 */
Deploy.prototype.action = function(operation, firstArg, packageDescription) {
    try {
        var data = {};

        if ('command' === operation) {
            data = dataResolver.runCommand(packageDescription, firstArg);

        } else if ('yaml' === operation) {
            data = dataResolver.runCommandFromYaml(packageDescription, firstArg);

        } else if ('tag' === operation) {
            data = dataResolver.runFarmerfileScript(packageDescription, firstArg);
        }

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
