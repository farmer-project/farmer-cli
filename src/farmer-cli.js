#!/usr/bin/env node
var auth = require('./auth'),
    program = require('commander').version('0.0.1');

auth.authorization().then(function () {

    require('./command/list')(program);
    require('./command/inspect')(program);
    require('./command/image')(program);
    require('./command/create')(program);
//require('./command/update')(program);

    program.parse(process.argv);

    if(!program.args.length) {
        program.help();
        process.exit(1);
    }

});

