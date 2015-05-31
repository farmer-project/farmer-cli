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
        .command('backup')
        .option('create <package> [tag]', 'Create a backup form a package')
        .option('restore <tag>', 'Restore backup')
        .option('delete <tag>', 'Delete generated backup')
        .description('Backup package public volumes files')
        .action(function (operation, firstArg, secArg) {
            self.action(operation, firstArg, secArg);
        });
};

/**
 *
 * @param {string} operation - Create or restore or delete
 * @param {string} firstArg - First argument
 * @param {string} secArg - Second argument
 */
Domain.prototype.action = function (operation, firstArg, secArg) {
    var data = {
        args: {}
    };

    if ('create' === operation) {
        data.args = {
            hostname: firstArg,
            tag: secArg
        };

        agent
            .createBackup(data)
            .then(function (res) {

                console.log('tag:', res.tag);

            }, console.log).finally(function () {
                process.exit(1);
            })
        ;

    } else if ('restore' === operation) {
        data.args = {
            tag: firstArg
        };

        agent
            .restoreBackup(data)
            .then(function (res) {

                console.log(res.result);

            }, console.log)
            .finally(function () {
                process.exit(1);
            })
        ;

    } else if ('delete' === operation) {
        data.args = {
            tag: firstArg
        };

        agent
            .deleteBackup(data)
            .then(function (res) {

                console.log(res.result);

            }, console.log)
            .finally(function () {
                process.exit(1);
            })
        ;
    }

};

module.exports = function (program) {
    return new Domain(program);
};
