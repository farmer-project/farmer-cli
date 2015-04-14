'use strict';

var mime       = require('mime'),
    YamlParser = require('./yaml'),
    JsonParser = require('./json');

function Parser() {
}

Parser.prototype.toJson = function (file) {
    var ext = mime.extension(mime.lookup(file));

    if (ext == 'yaml' || ext == 'yml') {
        return YamlParser(file);
    }

    if (ext == 'json') {
        return JsonParser(file);
    }

    return null;
};

module.exports = new Parser();
