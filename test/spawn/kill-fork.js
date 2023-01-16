import tap from 'tap';

import { spawn } from '../utils.js';

tap.test('should kill the forked processes', t => {
  spawn('pid.js', out => {
    const pid = parseInt(out, 10);

    if (!Number.isNaN(pid))
      return {
        exit: () => {
          setTimeout(() => {
            try {
              process.kill(pid);
              t.fail('child must no longer run');
            } catch (e) {
              t.end();
            }
          }, 500);
        }
      };
  });
});
