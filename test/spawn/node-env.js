import tap from 'tap';

import { spawn } from '../utils.js';

tap.test('should *not* set NODE_ENV', t => {
  spawn('env.js', out => {
    if (out.startsWith('NODE_ENV:')) {
      t.notMatch(out, /development/);
      return { exit: t.end.bind(t) };
    }
  });
});
