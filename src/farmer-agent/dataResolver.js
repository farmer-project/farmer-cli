'use strict';

function DataResolver() {

}

DataResolver.prototype.createSeed = function (data) {
    data['farmerfile']['shell'] = data['farmerfile']['shell']['create'];
    return data;
};

module.exports = new DataResolver();
