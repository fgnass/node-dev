var child = require('child_process');
var path = require('path');

var bin = path.join(__dirname, '..', '..', 'bin', 'node-dev');
var dir = path.join(__dirname, '..', 'fixture');

function spawn(cmd, cb) {
  var ps = child.spawn('node', [bin].concat(cmd.split(' ')), { cwd: dir });
  var out = '';
  var err = '';

  // capture stderr
  ps.stderr.on('data', function (data) {
    err += data.toString();
  });

  // invoke callback
  ps.on('exit', function (code, signal) {
    if (err) cb(err, code, signal);
  });

  ps.stdout.on('data', function (data) {
    out += data.toString();
    var ret = cb.call(ps, out);
    if (typeof ret == 'function') {
      // use the returned function as new callback
      cb = ret;
    } else if (ret && ret.exit) {
      // kill the process and invoke the given function
      ps.stdout.removeAllListeners('data');
      ps.stderr.removeAllListeners('data');
      ps.removeAllListeners('exit');
      ps.on('exit', function () { setTimeout(ret.exit, 0); });
      ps.kill();
    }
  });

  return ps;
}

module.exports = spawn;
