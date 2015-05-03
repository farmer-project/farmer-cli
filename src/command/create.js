var shelljs     = require('shelljs'),
    path        = require('path'),
    terminal    = require('../console'),
    Farmerfile  = require('../file/farmerfile'),
    Listener    = require('../event-listenr'),
    agent       = require('../farmer-agent'),
    config      = require(path.resolve(__dirname, '../../toolbelt.conf.js'));

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
    var farmerfile = new Farmerfile(path.join(shelljs.pwd() ,config.farmer_file));

    agent.createSeed(farmerfile.toJson()).then(function (res) {
        var listener = new Listener(config.station_server, res.room),
            subLevel = 0;

        listener.connect()
            .then(function () {
                listener.listen(function (receiveData) {
                    terminal.show(receiveData);
                });
            });

    }, console.log);

};

module.exports = function (program) {
    return new Create(program);
};
