import { spawn as _spawn } from 'child_process';
import { join } from 'path';
import touch from 'touch';
import { fileURLToPath } from 'url';

import { control } from '../lib/clear.js';

const bin = fileURLToPath(new URL('../bin/node-dev.js', import.meta.url));
const dir = fileURLToPath(new URL('fixture', import.meta.url));

const reClear = new RegExp(control);

const noop = () => {
  /**/
};

export function spawn(cmd, cb = noop) {
  const ps = _spawn('node', [bin].concat(cmd.split(' ')), { cwd: dir });
  let err = '';

  function errorHandler(data) {
    err += data.toString();
    outHandler(data);
  }

  function exitHandler(code, signal) {
    if (err) cb(err, code, signal);
  }

  function outHandler(data) {
    // Don't log clear
    console.log(data.toString().replace(reClear, ''));

    const ret = cb.call(ps, data.toString());

    if (typeof ret === 'function') {
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
}

// filewatcher requires a new mtime to trigger a change event
// but most file systems only have second precision, so wait
// one full second before touching.

export function touchFile(...filepath) {
  setTimeout(() => touch(join(dir, ...filepath)), 1000);
}
