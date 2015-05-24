'use strict';

var Q        = require('q'),
    Listener = require('../event-listenr'),
    Terminal = require('../terminal'),
    agent    = require('../farmer-agent'),
    config   = require('../config');

function Domain(program) {
    this.program = program;
    this.init();
}

/**
 * Initialize Commander object for domain command
 */
Domain.prototype.init = function () {
    var self = this;

    this.program
        .command('domain')
        .option('add', 'Add a domain')
        .option('remove', 'Remove a domain')
        .description('Manage container domain')
        .action(function (env, options, domain) {
            self.action(env, options, domain);
        });
};

/**
 *
 * @param {string} operation - add or remove
 * @param {string} description - PACKAGE_NAME:CONTAINER_ALIAS:PORT
 * @param {string} domain - domain you want to assign to container
 */
Domain.prototype.action = function (operation, description, domain) {
    var info = description.split(':'),
        data = {
            args: {
                hostname: info[0],
                alias: info[1],
                port: info[2] || '80'
            }
        };

    if (!info[0] || !info[1]) {
        console.log();
        return console.log('package description error');
    }

    if ('add' === operation) {
        agent.assignDomain(data).then(function (res) {
            console.log('domain:', res.result);
        }, console.log).finally(function () {
            process.exit(1);
        });

    } else if ('remove' === operation) {
        agent.unassignDomain(data).then(function (res) {
            console.log('domain:', res.result);
        }, console.log).finally(function () {
            process.exit(1);
        });
    }

};

module.exports = function (program) {
    return new Domain(program);
};
