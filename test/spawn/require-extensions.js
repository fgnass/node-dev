import tap from 'tap';

import { spawn } from '../utils.js';

tap.test('should be resistant to breaking `require.extensions`', t => {
  spawn('modify-extensions.js', out => {
    t.notOk(/TypeError/.test(out));
    if (out.match('extensions modified')) return { exit: t.end.bind(t) };
  });
});
