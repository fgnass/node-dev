var fs = require('fs');
var path = require('path');
var vm = require('vm');
var file = path.join(__dirname, 'log.js');
var str = fs.readFileSync(file, 'utf8');

if (process.argv.length > 2 && process.argv[2] === 'nofile') {
  vm.runInNewContext(str, { module: {}, require: require, console: console });
} else {
  vm.runInNewContext(str, { module: {}, require: require, console: console }, file);
}

// Listen for events to keep running
process.on('message', function () {});
