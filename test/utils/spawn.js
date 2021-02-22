const child = require('child_process');
const path = require('path');

const bin = path.join(__dirname, '..', '..', 'bin', 'node-dev');
const dir = path.join(__dirname, '..', 'fixture');

module.exports = (cmd, cb) => {
  const ps = child.spawn('node', [bin].concat(cmd.split(' ')), { cwd: dir });
  let err = '';

  function errorHandler(data) {
    err += data.toString();
    outHandler(data);
  }

  function exitHandler(code, signal) {
    if (err) cb(err, code, signal);
  }

  function outHandler(data) {
    console.log(data.toString());
    const ret = cb.call(ps, data.toString());

    if (typeof ret == 'function') {
      // use the returned function as new callback
      cb = ret;
    } else if (ret && ret.exit) {
      // kill the process and invoke the given function
      ps.removeListener('exit', exitHandler);
      ps.once('exit', code => {
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
};
