'use strict';

/**
 * @param {Object} program - Commander object
 * @constructor
 */
function Reconfigure(program) {
    this.program = program;
    this.init();
}

/**
 * Initialize Commander object for create command
 */
Reconfigure.prototype.init = function () {
    var self = this;

    this.program
        .command('reconfigure')
        .description('Reconfigure farmer client')
        .action(function (env, options) {
            self.action(env, options);
        });
};

/**
 * Create command action definition
 * @param {string} env - First command value without tag
 * @param {Object} options - Commander options object
 */
Reconfigure.prototype.action = function(env, options) {
    require('../reconfigure')();
};

module.exports = function (program) {
    return new Reconfigure(program);
};
