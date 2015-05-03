var shelljs     = require('shelljs'),
    Farmerfile  = require('../file/farmerfile'),
    Listener    = require('../event-listenr'),
    agent       = require('../farmer-agent'),
    path        = require('path'),
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

    agent.createSeed(farmerfile.toJson()).then(function (resBody) {
        var listener = new Listener(config.station_server, resBody.room),
            subLevel = 0;

        listener.connect()
            .then(function () {
                listener.listen(function (receiveData) {
                    if (receiveData['type'] === 'notify') {
                        console.log('in type part', receiveData['type']);
                        if (receiveData['tag'] === 'START_FLAG_UP')
                            subLevel++;
                        if (receiveData['tag'] === 'START_FLAG_DOWN')
                            subLevel--;

                        console.log('subLevel', subLevel);
                    }

                    if (subLevel < 0) {
                        listener.disconnect();
                    } else {
                        console.log('receiveData', receiveData);
                        if (receiveData['type'] === 'message') {
                            var tab = '    ';
                            for (var i=0; i<subLevel; i++) {
                                tab += tab;
                            }
                            delete receiveData['type'];
                            console.log(tab + ' * ' ,receiveData);
                        }

                        if (receiveData['type'] === 'file') {

                        }
                    }
                });
            });

    }, console.log);

};

module.exports = function (program) {
    return new Create(program);
};
