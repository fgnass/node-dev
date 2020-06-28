var child = require('child_process');
var path = require('path');

var bin = path.join(__dirname, '..', '..', 'bin', 'node-dev');
var dir = path.join(__dirname, '..', 'fixture');

function spawn(cmd, cb) {
  var ps = child.spawn('node', [bin].concat(cmd.split(' ')), { cwd: dir });
  var err = '';

  function errorHandler(data) {
    console.log(data.toString());
    err += data.toString();
  }

  function exitHandler(code, signal) {
    if (err) cb(err, code, signal);
  }

  function outHandler(data) {
    var ret = cb.call(ps, data.toString());

    if (typeof ret == 'function') {
      // use the returned function as new callback
      cb = ret;
    } else if (ret && ret.exit) {
      // kill the process and invoke the given function
      ps.removeListener('exit', exitHandler);
      ps.once('exit', function (code) {
        console.log(`Process is exiting with code: ${code}`);
        ps.stdout.removeListener('data', outHandler);
        ps.stderr.removeListener('data', errorHandler);
        ret.exit(code);
      });
      ps.kill('SIGTERM');
    }
  }

  ps.stderr.on('data', errorHandler);
  ps.once('exit', exitHandler);
  ps.stdout.on('data', outHandler);

  return ps;
}

module.exports = spawn;
