import tap from 'tap';

import { spawn } from '../utils.js';

tap.test('should pass unknown args to node binary', t => {
  spawn('--expose_gc gc.js foo', out => {
    if (out.trim() === 'foo function') return { exit: t.end.bind(t) };
  });
});
