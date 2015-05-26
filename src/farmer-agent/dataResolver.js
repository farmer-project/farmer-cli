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
 * @param {string} commands - Shell command string or yaml file address or farmer file shell tag
 * @returns {{args: {hostname: *}}}
 */
DataResolver.prototype.runOnSeed = function (hostname, commands) {
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

    // shell command string
    if (packageContainer.length > 1) {
        data['farmerfile']['shell'][packageContainer[1]] = [commands];

    } else {
        // yml file containe shell commands
        var isYmlFile = ['.yml', '.yaml'].indexOf(path.extname(commands));
        if (isYmlFile > -1) {
            file.setPath(commands);

            // relative path
            if (commands.indexOf('/') !== 0) {
                file.setPath(path.join(shelljs.pwd(), commands));
            }

            if (!file.isExist()) {
                throw new Error('File does not exists!');
            }

            data['farmerfile']['shell'] = file.toJson();

        // farmer file shell tag
        } else {
            var uri         = path.join(shelljs.pwd(), config.FARMER_FILE),
                farmerJson  = file.setPath(uri).toJson();

            data['farmerfile']['shell'] = farmerJson['shell'][commands];
        }

    }

    return data;
};

module.exports = new DataResolver();
