'use strict';

var fs = require('fs'),
    parser = require('./parser');

function File(file) {
    file && this.setPath(file);
    this._absolutePath = null;
}

File.prototype.toJson = function () {
    return parser.toJson(this.getAbsolutePath());
};

File.prototype.getAddress = function () {
    return this.path;
};

File.prototype.readSync = function () {
    return fs.readFileSync(this.getAbsolutePath());
};

File.prototype.writeSync = function (data) {
    var addressArr = this.getAbsolutePath().split('/');
        var file = addressArr[addressArr.length - 1];
        var directory = this.getAbsolutePath().substr(0, (this.getAbsolutePath().length - file.length));

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, '0755', true);
    }

    fs.writeFileSync(this.getAbsolutePath(), data);
};

File.prototype._getUserHome = function () {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
};

File.prototype.setPath = function (path) {
    this.path = path;
    this._absolutePath = null;

    return this;
};

File.prototype.getAbsolutePath = function () {
    if (null ===  this._absolutePath) {
        this._absolutePath = this.path
            .replace(/\/\.\//g, '')
            .replace(/\.\//g, '')
            .replace(/^~/, this._getUserHome());
    }

    return this._absolutePath;
};

module.exports = File;
