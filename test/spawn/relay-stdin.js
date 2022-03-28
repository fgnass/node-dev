import tap from 'tap';

import { spawn } from '../utils.js';

tap.test('should relay stdin', t => {
  spawn('echo.js', out => {
    if (out === 'foo') return { exit: t.end.bind(t) };
  }).stdin.write('foo');
});
