import tap from 'tap';

import { spawn } from '../utils.js';

tap.test('should ignore caught errors', t => {
  spawn('catch-no-such-module.js', out => {
    if (out.match(/^Caught Error/)) return { exit: t.end.bind(t) };
  });
});
