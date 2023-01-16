import tap from 'tap';

import { spawn } from '../utils.js';

tap.test('should pass through the exit code', t => {
  spawn('exit.js').on('exit', code => {
    t.equal(code, 101);
    t.end();
  });
});
