'use strict';

var prompt      = require('prompt'),
    File        = require('./file');

module.exports = function () {
    var schema = {
        properties: {
            api: {
                message: 'farmer server api address',
                type: 'string',
                required: true
            },
            host: {
                description: '(Rabbit-MQ) station server address',
                message: 'Station server address must be set',
                type: 'string',
                required: true
            },
            login: {
                description: '(Rabbit-MQ) username',
                type: 'string',
                message: 'Username must be set',
                required: true
            },
            password: {
                description: '(Rabbit-MQ) password',
                hidden: true,
                type: 'string',
                message: 'Password must be set',
                required: true
            }
        }
    };
    prompt.start();
    prompt.get(schema, function (err, result) {
        var configFile = new File('~/.farmer.config.json');

        var config = {
            FARMER_FILE: '.farmer.yml',
            API: result.api,
            STATION_SERVER: {
                host: result.host,
                login: result.login,
                password: result.password
            }
        };

        configFile.writeSync(JSON.stringify(config));
    });
};