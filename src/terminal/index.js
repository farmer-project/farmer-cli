'use strict';

function Terminal() {
    this.subLevel = 0;
}

/**
 * Display received data in format on terminal
 * @param {Object|string} data
 */
Terminal.prototype.show = function (data) {
    if (data['type'] === 'notify') {
        if (data['tag'] === 'START_FLAG_UP') { this.subLevel++; }
        if (data['tag'] === 'START_FLAG_DOWN') { this.subLevel--; }
    }

    if (this.subLevel > 0) {
        if (data['type'] === 'message') {
            var tab = '    ';
            for (var i = 0 ; i < this.subLevel ; i++) {
                tab += tab;
            }
            delete data['type'];
            console.log(tab + ' * ', data);
        }
    }
};

module.exports = Terminal;
