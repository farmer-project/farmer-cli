'use strict';

var Q = require('q'),
    parser = require('./parser');

function File(file) {
    this.file = this._uriResolver(file);
}

File.prototype._uriResolver = function (address) {
    return address.replace(/\/\.\//g, '').replace(/\.\//g, '');
};

File.prototype.toJson = function () {
    return parser.toJson(this.file);
};

File.prototype.getAddress = function () {
    return this.file;
};

module.exports = File;

