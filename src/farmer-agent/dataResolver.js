'use strict';

function DataResolver() {

}

DataResolver.prototype.createSeed = function (data) {
    if (data['farmerfile']['shell']) {
        data['farmerfile']['shell'] = data['farmerfile']['shell']['create'];
    }

    return data;
};

DataResolver.prototype.deploySeed = function (data) {
    if (data['farmerfile']['shell']) {
        data['farmerfile']['shell'] = data['farmerfile']['shell']['deploy'];
    }

    return data;
};

module.exports = new DataResolver();
