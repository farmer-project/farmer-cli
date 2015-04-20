var request = require('request'),
    shelljs = require('shelljs'),
    Procfile = require('../procfile'),
    Listener = require('../event-listenr'),
    config = require('../../toolbelt.conf.js');

function Create(program) {
    this.program = program;
    this.init();
}

Create.prototype.init = function () {
    var self = this;

    this.program
        .command('create')
        .description('Create a stage')
        .action(function (env, options) {
            self.action(env, options);
        });
};

Create.prototype.action = function(name, options) {

    var profile = new Procfile(shelljs.pwd() + '/procfile.yml');

    profile.toJson().then(function (json) {

        var opt = {
            uri: config.api + '/container/greenhouse/create',
            method: 'POST',
            json: json
        };

        request(opt, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // 200 – no error
                var listener = new Listener(config.station_server, body.id),
                    level = 0;

                listener.connect()
                    .then(function () {
                        listener.listen(function (receiveData) {
                            var sub = (level == receiveData.level);
                            level = receiveData.level;
                            delete receiveData['level'];

                            if (sub)
                                console.log('---------' + JSON.stringify(receiveData));
                            else
                                console.log(receiveData);
                        });
                    });

            } else {
                // 500 – server error
                if (body)
                    console.log('error: ', body.error);
                console.log('error: ', error);
            }

        });

    }, function (error) {
        console.log('Invalid file content');
    });

};

module.exports = function (program) {
    return new Create(program);
};