'use strict';

var createAction    = require('./api-client/actions/CreateAction'),
    dataResolver    = require('./dataResolver'),
    config          =   require('../../toolbelt.conf');

function Agent () {
}

Agent.prototype.createSeed = function (farmerfile) {

    return createAction
        .setData(dataResolver.createSeed(farmerfile))
        .executeOn({
            api: config.station_server
        });
};

Agent.prototype.deploySeed = function (farmerfile) {

};

Agent.prototype.destroySeed = function (farmerfile) {

};

Agent.prototype.testSeed = function (farmerfile) {

};

Agent.prototype.releaseSeed = function (farmerfile) {

};

Agent.prototype.setupPlant = function (farmerfile) {

};

Agent.prototype.updatePlant = function (farmerfile) {

};

Agent.prototype.destroyPlant = function (farmerfile) {

};

Agent.prototype.getDataFor = function () {

};

module.exports = new Agent();
