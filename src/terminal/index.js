'use strict';

var util = require('util');

function Terminal() {
    this.subLevel = 1;
}

/**
 * Display received data in format on terminal
 * @param {Object|string} data
 */
Terminal.prototype.show = function (data) {
    if (data['type'] === 'notify') {
        if (data['tag'] === 'START_FLAG_UP') { this.subLevel++; }
        if (data['tag'] === 'START_FLAG_DOWN') { this.subLevel--; }
        return this.subLevel;
    }

    if (this.subLevel > 0) {
        if (data['type'] === 'message') {
            var tab = '  ';
            for (var i = 0 ; i < this.subLevel - 1 ; i++) {
                tab += tab;
            }

            delete data['type'];

            if (data['data']) {
                if (typeof data['data'] === 'string') {
                    process.stdout.write(data['data']);
                } else if (typeof data['data'] === 'object') {
                    process.stdout.write(util.inspect(data['data'], false, null) + '\n');
                }
            }
        }
    }

    return this.subLevel;
};

module.exports = Terminal;
