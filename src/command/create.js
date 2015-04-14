var request = require('request'),
    config = require('../../farmer.conf');

function Create(program) {
    this.program = program;
    this.init();
}

Create.prototype.init = function () {
    var self = this;

    this.program
        .command('create <name>')
        .description('Create a staging container')
        .option("-p, --package <package_name>", 'set package name')
        .option("-r, --repo <repository_url>", 'set repository')
        .option("-b, --branch <branch_name>", 'branch name')
        .option("-c, --commit <commit_id>", 'commit id')
        .option("-t, --tag <tag>", 'tag')
        .action(function (env, options) {
            self.action(env, options);
        });
};

Create.prototype.action = function(name, options) {

    if (typeof options.repo === 'undefined') {
        console.error('Option -r, --repo <repository_url> is required!');
        process.exit(1);
    }

    var opt = {
            uri: config.server_address + '/container/greenhouse/create',
            method: 'POST',
            json: {
                'name': name,
                'repo': options.repo,
                'package': options.package || 'base',
                'branch': options.branch || 'master',
                'commit': options.commit || null,
                'tag': options.tag || null
            }
        };

    request(opt, function (error, response, body) {
        console.log(typeof body);
        if (!error && response.statusCode == 200) {
            // 200 – no error
            console.log(body.result);

        } else {
            // 500 – server error
            console.log('error: ', body.error);
        }

    });

};

module.exports = function (program) {
    return new Create(program);
};