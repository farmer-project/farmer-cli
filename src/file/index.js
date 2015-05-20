'use strict';

var fs      = require('fs'),
    parser  = require('./parser');

function File(file) {
    file && this.setPath(file);
    this._absolutePath = null;
}

/**
 * Convert file data to json
 */
File.prototype.toJson = function () {
    return parser.toJson(this.getAbsolutePath());
};

/**
 * Get file address
 * @returns {*}
 */
File.prototype.getAddress = function () {
    return this.path;
};

/**
 * Read file content sync
 * @returns {*}
 */
File.prototype.readSync = function () {
    return fs.readFileSync(this.getAbsolutePath());
};

/**
 * Write content sync
 * @param {String|Buffer} data
 */
File.prototype.writeSync = function (data) {
    var addressArr = this.getAbsolutePath().split('/'),
        file = addressArr[addressArr.length - 1],
        directory = this.getAbsolutePath()
            .substr(0, (this.getAbsolutePath().length - file.length));

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, '0755', true);
    }

    fs.writeFileSync(this.getAbsolutePath(), data);
};

/**
 * Get current user home address
 * @returns {*}
 * @private
 */
File.prototype.getUserHome = function () {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
};

/**
 * Set file Object address
 * @param {string} path - Absolute or relative address
 * @returns {File}
 */
File.prototype.setPath = function (path) {
    this.path = path;
    this._absolutePath = null;

    return this;
};

/**
 * Get file Absolute address
 * @returns {null|XML|string|*}
 */
File.prototype.getAbsolutePath = function () {
    if (null ===  this._absolutePath) {
        this._absolutePath = this.path
            .replace(/\/\.\//g, '')
            .replace(/\.\//g, '')
            .replace(/^~/, this.getUserHome());
    }

    return this._absolutePath;
};

/**
 * Return true when file is exist otherwise return false
 * @returns {*}
 */
File.prototype.isExist = function () {
    return fs.existsSync(this.getAbsolutePath());
};

module.exports = File;
