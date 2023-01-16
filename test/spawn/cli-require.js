import tap from 'tap';

import { spawn, touchFile } from '../utils.js';

tap.test('Supports require from the command-line (ts-node/register)', t => {
  spawn('--require=ts-node/register typescript/index.ts', out => {
    if (out.match(/touch message.ts/)) {
      touchFile('typescript', 'message.ts');
      return out2 => {
        if (out2.match(/Restarting/)) {
          t.match(out2, /\[INFO\] \d{2}:\d{2}:\d{2} Restarting/);
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});
