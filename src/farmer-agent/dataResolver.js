'use strict';

var path        = require('path'),
    shelljs     = require('shelljs'),
    File        = require('../file'),
    Farmerfile  = require('../file/farmerfile'),
    config      = require('../config');

function DataResolver() {

}

/**
 * Filter and resolve data in order to create on seed
 * @param {string} hostname - package hostname
 * @returns {*}
 */
DataResolver.prototype.createSeed = function (hostname) {
    var fileUri = path.join(shelljs.pwd(), config.FARMER_FILE),
        farmerFile = new Farmerfile(fileUri),
        data = {
            farmerfile: farmerFile.toJson(),
            args: {
                hostname: hostname
            }
        };

    if (data['farmerfile']['shell']) {
        data['farmerfile']['shell'] = data['farmerfile']['shell']['create'];
    }

    return data;
};

/**
 * Filter and resolve data in order to deploy on seed
 * @param {string} hostname - package hostname
 * @returns {*}
 */
DataResolver.prototype.deploySeed = function (hostname) {
    var fileUri = path.join(shelljs.pwd(), config.FARMER_FILE),
        farmerFile = new Farmerfile(fileUri),
        data = {
            farmerfile: farmerFile.toJson(),
            args: {
                hostname: hostname
            }
        };

    if (data['farmerfile']['shell']) {
        data['farmerfile']['shell'] = data['farmerfile']['shell']['deploy'];
    }

    return data;
};

/**
 * Filter and resolve data in order to run script on seed
 * @param {string} hostname - Package hostname
 * @param {string} command - Shell command string
 * @returns {{args: {hostname: *}}}
 */
DataResolver.prototype.runCommand = function (hostname, command) {
    var file = new File(),
        packageContainer = hostname.split(':'),
        data = {
            farmerfile: {
                shell: {}
            },
            args: {
                hostname: packageContainer[0]
            }
        };

    if (packageContainer.length < 2) {
        throw new Error('Package description error! package:alias');
    }

    data['farmerfile']['shell'][packageContainer[1]] = [command];

    return data;
};

/**
 * Set shell yaml commands on spec container
 * @param {string} hostname - PACKAGE_NAME:CONTAINER_ALIAS
 * @param {string} yamlFile - Absolute or relative yaml file address
 * @returns {{farmerfile: {shell: {}}, args: {hostname: *}}}
 */
DataResolver.prototype.runCommandFromYaml = function (hostname, yamlFile) {
    var file = new File(yamlFile),
        isYmlFile = ['.yml', '.yaml'].indexOf(path.extname(yamlFile)) + 1,
        packageContainer = hostname.split(':'),
        data = {
            farmerfile: {
                shell: {}
            },
            args: {
                hostname: packageContainer[0]
            }
        };

    // relative path
    if (yamlFile.indexOf('/') !== 0) {
        file.setPath(path.join(shelljs.pwd(), yamlFile));
    }

    if (packageContainer.length < 2) {
        throw new Error('Package description error! package:alias');
    }

    if (!isYmlFile) {
        throw new Error('File type error!');
    }

    if (!file.isExist()) {
        throw new Error('Yaml file does not exists!');
    }

    data['farmerfile']['shell'][packageContainer[1]] = file.toJson();

    return data;
};

/**
 * Set shell command on spec container from farmer file
 * @param {string} hostname - PACKAGE_NAME:CONTAINER_ALIAS
 * @param {string} tag - farmer file shell subtag
 * @returns {{farmerfile: {shell: {}}, args: {hostname: *}}}
 */
DataResolver.prototype.runFarmerfileScript = function (hostname, tag) {
    var file = new File(path.join(shelljs.pwd(), config.FARMER_FILE)),
        farmerJson  = file.toJson(),
        packageContainer = hostname.split(':'),
        data = {
            farmerfile: {
                shell: {}
            },
            args: {
                hostname: packageContainer[0]
            }
        };

    data['farmerfile']['shell'] = farmerJson['shell'][tag];

    return data;
};

module.exports = new DataResolver();
