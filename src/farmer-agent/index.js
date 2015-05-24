'use strict';

var createAction            = require('./api-client/actions/createAction'),
    deployAction            = require('./api-client/actions/deployAction'),
    deleteAction            = require('./api-client/actions/deleteAction'),
    inspectAction           = require('./api-client/actions/inspectAction'),
    listAction              = require('./api-client/actions/listAction'),
    assignDomainAction      = require('./api-client/actions/assignDomainAction'),
    unassignDomainAction    = require('./api-client/actions/unassignDomainAction'),
    dataResolver            = require('./dataResolver'),
    config                  = require('../config');

function Agent () {
}

Agent.prototype.createSeed = function (data) {
    return createAction
        .setData(dataResolver.createSeed(data))
        .executeOn({
            api: config.API
        });
};

Agent.prototype.deleteSeed = function (data) {
    return deleteAction
        .setData(data)
        .executeOn({
            api: config.API
        });
};

Agent.prototype.inspect = function (data) {
    return inspectAction
        .setData(data)
        .executeOn({
            api: config.API
        });
};

Agent.prototype.deploySeed = function (data) {
    return deployAction
        .setData(dataResolver.deploySeed(data))
        .executeOn({
            api: config.API
        });
};

Agent.prototype.list = function () {
    return listAction
        .executeOn({
            api: config.API
        });
};

Agent.prototype.assignDomain = function (data) {
    return assignDomainAction
        .setData(data)
        .executeOn({
            api: config.API
        });
};

Agent.prototype.unassignDomain = function (data) {
    return unassignDomainAction
        .setData(data)
        .executeOn({
            api: config.API
        });
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
