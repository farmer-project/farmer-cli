#!/usr/bin/env node
var pkjson = require('../package.json'),
    program = require('commander').version(pkjson.version);

require('./command/create')(program);
require('./command/deploy')(program);
require('./command/run')(program);
require('./command/delete')(program);
require('./command/list')(program);
require('./command/inspect')(program);
require('./command/domain')(program);
require('./command/backup')(program);
//require('./command/image')(program);
//require('./command/update')(program);

require('./command/reconfigure')(program);

program.parse(process.argv);

if (!program.args.length) {
    program.help();
    process.exit(1);
}
