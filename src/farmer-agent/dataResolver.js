'use strict';

var util = require('util');

function DataResolver() {
}

DataResolver.prototype.createSeed = function (farmerfile) {
    var data = farmerfile;
    data['shell'] = data['shell']['create'];
    return data;
};

module.exports = new DataResolver();
