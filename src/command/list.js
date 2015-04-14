var request = require('request'),
    config  = require('../../farmer.conf');

function List(program) {
    this.validTypes = ['production', 'staging'];
    this.type = 'staging';
    this.program = program;

    this.init();
}

List.prototype.init = function () {
    var self = this;

    this.program
        .command('list')
        .description('Get containers list')
        .option(
            "-t, --type [type]", "set container type [production, staging]",
            function (type) {
                self.setType(type);
            }
        )
        .action(function (env) {
            self.action(env);
        });
};

List.prototype.action = function (env) {
    var options = {
            uri: config.server_address + 'container/' + this.type + '/list',
            method: 'GET'
        };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // 200 – no error
            console.log(JSON.parse(body).result);

        } else {
            // 500 – server error
            console.log('request error', error);
            console.log('error: ', JSON.parse(body).error);
        }
    });
};

List.prototype.setType = function (type) {
    if(this.validTypes.indexOf(type) > -1) {
        this.type = type;
    } else {
        console.log('');
        console.log('Type must be "staging" or "production"');
        console.log('');

        process.exit(1);
    }
};


module.exports = function (program) {
    return new List(program);
};