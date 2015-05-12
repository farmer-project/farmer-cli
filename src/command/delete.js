'use strict';

var Terminal    = require('../terminal'),
    Listener    = require('../event-listenr'),
    agent       = require('../farmer-agent');

/**
 * @param {Object} program - Commander object
 * @constructor
 */
function Delete(program) {
    this.program = program;
    this.init();
}

/**
 * Initialize Commander object for Delete command
 */
Delete.prototype.init = function () {
    var self = this;

    this.program
        .command('delete')
        .option('-k, --keep-volumes [keepVolumes]', 'keep package volumes')
        .description('Delete package')
        .action(self.action);
};

/**
 * Delete command action definition
 * @param {string} hostname - First command value without tag
 * @param {Object} options - Second command value without tag
 */
Delete.prototype.action = function(hostname, options) {
    var data = {
            args: {
                hostname: hostname,
                deleteVolume: true && !options.keepVolumes
            }
        };

    agent.deleteSeed(data).then(function (res) {
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
    return new Delete(program);
};
