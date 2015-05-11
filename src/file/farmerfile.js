'use strict';

var Q    = require('q'),
    path = require('path'),
    File = require('./index');

function Farmerfile (address) {
    this.farmerfile = new File(address);
    this.includeFiles = ['.yml', '.yaml'];
}

Farmerfile.prototype.toJson = function () {
    var self = this,
        file = new File(),
        jsonFarmerfileContent = this.farmerfile.toJson();

    var recurse = function (obj) {
        for (var p in obj) {
            if (typeof obj[p] !== 'object') {
                var extension = path.extname(obj[p]);

                // Defined file will be include
                if (self.includeFiles.indexOf(extension) > -1) {
                    var fileAddress = obj[p],
                        rootDir = path.dirname(self.farmerfile);
                    // set file path
                    file.setPath(path.resolve(rootDir, fileAddress));

                    // File json replaced with it's address
                    obj[p] = file.toJson();
                }
            // it's not an object
            } else {
                recurse(obj[p]);
            }
        }
    };
    recurse(jsonFarmerfileContent);

    return jsonFarmerfileContent;
};

module.exports = Farmerfile;
