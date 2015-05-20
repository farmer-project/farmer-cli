'use strict';

var Q        = require('q'),
    Listener = require('../event-listenr'),
    Terminal = require('../terminal'),
    agent    = require('../farmer-agent'),
    config   = require('../../toolbelt.conf.js');

function Inspect(program) {
    this.program = program;
    this.init();
}

/**
 * Initialize Commander object for inspect command
 */
Inspect.prototype.init = function () {
    var self = this;

    this.program
        .command('inspect <hostname>')
        .description('Get package information')
        .action(function (env, options) {
            self.action(env, options);
        });
};

/**
 * Inspect command action definition
 * @param {string} hostname - First command value without tag
 * @param {Object} options - Commander options object
 */
Inspect.prototype.action = function (hostname, options) {
    var data = {
        args: {
            hostname: hostname
        }
    };

    agent.inspect(data).then(function (res) {
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

    }, console.log).finally(function () {
        process.exit(1);
    });
};

module.exports = function (program) {
    return new Inspect(program);
};
