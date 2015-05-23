#!/usr/bin/env node
require('./exit-handler');
var program = require('commander').version('0.0.1');

require('./command/create')(program);
require('./command/deploy')(program);
require('./command/delete')(program);
require('./command/list')(program);
require('./command/inspect')(program);
//require('./command/image')(program);
//require('./command/update')(program);

require('./command/reconfigure')(program);

program.parse(process.argv);

if (!program.args.length) {
    program.help();
    process.exit(1);
}
