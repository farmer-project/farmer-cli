'use strict';

var Listener = require('../event-listenr'),
    Terminal = require('../terminal'),
    agent    = require('../farmer-agent'),
    config   = require('../../toolbelt.conf.js');

function Inspect(program) {
    program
        .command('inspect <hostname>')
        .description('Get package information')
        .action(this.action);
}

/**
 * Initialize Commander object for Inspect command
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

        listener.connect()
            .then(function () {
                listener.listen(function (receiveData) {
                    terminal.show(receiveData);
                });
            });

    }, console.log);
};

module.exports = function (program) {
    return new Inspect(program);
};
