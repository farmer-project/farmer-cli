'use strict';

var Q        = require('q'),
    Listener = require('../event-listenr'),
    Terminal = require('../terminal'),
    agent    = require('../farmer-agent'),
    config   = require('../config');

function List(program) {
    this.validTypes = ['production', 'staging'];
    this.type = 'staging';
    this.program = program;

    this.init();
}

/**
 * Initialize Commander object for inspect command
 */
List.prototype.init = function () {
    var self = this;

    this.program
        .command('list')
        .description('Get containers list')
        .action(function (env, options) {
            self.action(env, options);
        });
};

/**
 * Inspect command action definition
 * @param {string} env - First command value without tag
 * @param {Object} options - Commander options object
 */
List.prototype.action = function (env, options) {
    agent.list().then(function (res) {
        var hostnames = JSON.parse((JSON.parse(res)).result);
        hostnames.forEach(function (host) {
            console.log(host.hostname);
        });
    }, console.log).finally(function () {
        process.exit(1);
    });
};

module.exports = function (program) {
    return new List(program);
};