import tap from 'tap';

import { spawn } from '../utils.js';

tap.test('should conceal the wrapper', t => {
  // require.main should be main.js not wrap.js!
  spawn('main.js').on('exit', code => {
    t.equal(code, 0);
    t.end();
  });
});
