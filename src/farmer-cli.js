//#!/usr/bin/env node
/*var program = require('commander').version('0.0.1');

require('./command/list')(program);
require('./command/inspect')(program);
require('./command/image')(program);
require('./command/create')(program);
//require('./command/update')(program);

program.parse(process.argv);

if(!program.args.length) {
    program.help();
    process.exit(1);
}*/

var FarmerFile  = require('./file/farmerfile'),
    dataResolver= require('./farmer-agent/dataResolver'),
    path        = require('path'),
    shelljs     = require('shelljs'),
    config      = require('../toolbelt.conf');

var foo1 = new FarmerFile(path.join(shelljs.pwd(), config.farmer_file));

console.log(dataResolver.createSeed(foo1.toJson()));