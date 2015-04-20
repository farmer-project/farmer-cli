var request = require('request'),
    config = require('../../toolbelt.conf.js');

function Inspect(program) {
    program
        .command('inspect <id>')
        .description('Get container information by container id')
        .action(this.action);
}

Inspect.prototype.action = function (id) {
    var options = {
        uri: config.api + '/container/' + id,
        method: 'GET'
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // 200 – no error
            console.log(JSON.parse(body).result);

        } else {
            // 500 – server error
            console.log('Request error', error);
            console.log('error: ', JSON.parse(body).error);
        }
    });
};

module.exports = function (program) {
    return new Inspect(program);
};