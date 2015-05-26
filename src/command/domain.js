'use strict';

var Q        = require('q'),
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
        .option('add <package:alias> <domain>', 'Add a domain')
        .option('remove <package:alias> <domain>', 'Remove a domain')
        .description('Manage container domain')
        .action(function (operation, description, domain) {
            self.action(operation, description, domain);
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
                port: info[2] || '80',
                domain: domain
            }
        };

    if (!info[0] || !info[1]) {
        return console.log('package description error! package:alias');
    }

    if ('add' === operation) {
        agent.assignDomain(data).then(function (res) {
            console.log('domain:', res.result);
        }, console.log).finally(function () {
            process.exit(1);
        });

    } else if ('remove' === operation) {
        agent.unassignDomain(data).then(function (res) {
            console.log(res.result);
        }, console.log).finally(function () {
            process.exit(1);
        });
    }

};

module.exports = function (program) {
    return new Domain(program);
};
