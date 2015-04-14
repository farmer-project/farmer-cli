'use strict';

var parser = require('js-yaml'),
    fs = require('fs'),
    Q = require('q');

module.exports = function (file) {
    return parser.safeLoad( fs.readFileSync(file, 'utf8') );
};