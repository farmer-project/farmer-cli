'use strict';

var Q    = require('q'),
    path = require('path'),
    File = require('./index');

function Farmerfile (address) {
    this.farmerfile = new File(address);
    this.validFiles = ['yml', 'yaml'];
}

Farmerfile.prototype.toJson = function () {
    var self = this,
        file = new File(),
        jsonFarmerfileContent = this.farmerfile.toJson();

    var recurse = function (obj) {
        for (var p in obj) {
            if (typeof obj[p] !== 'object') {
                if (self.validFiles.indexOf(path.extname(obj[p]))) {
                    var fileAddress = obj[p],
                        rootDir = path.dirname(self.farmerfile);
                    file.setPath(path.resolve(rootDir, fileAddress));

                    // include file json data instead of it's file address
                    obj[p] = file.toJson();
                }
            } else {
                recurse(obj[p]);
            }
        }
    };
    recurse(jsonFarmerfileContent);

    return jsonFarmerfileContent;
};

module.exports = Farmerfile;
