var File = require('./file'),
    configFile = new File('~/.farmer.config.json');

module.exports = JSON.parse(configFile.readSync());