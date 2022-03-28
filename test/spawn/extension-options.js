import tap from 'tap';

import { spawn } from '../utils.js';

tap.test('should pass options to extensions according to .node-dev.json', t => {
  spawn('extension-options', out => {
    if (out.match(/\{ test: true \}/)) return { exit: t.end.bind(t) };
  });
});
