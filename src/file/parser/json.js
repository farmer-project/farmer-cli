'use strict';

var fs       = require('fs');

module.exports = function json(file) {
    return fs.readFileSync(file, 'utf8');
};
