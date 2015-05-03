'use strict';

var parser  = require('js-yaml'),
    fs      = require('fs');

module.exports = function (file) {
    return parser.safeLoad( fs.readFileSync(file, 'utf8') );
};