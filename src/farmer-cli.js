#!/usr/bin/env node
var program = require('commander').version('0.0.1');

//require('./command/list')(program);
require('./command/inspect')(program);
//require('./command/image')(program);
require('./command/create')(program);
require('./command/delete')(program);
//require('./command/update')(program);

program.parse(process.argv);

if (!program.args.length) {
    program.help();
    process.exit(1);
}
