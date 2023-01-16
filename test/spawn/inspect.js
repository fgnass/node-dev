import tap from 'tap';

import { spawn, touchFile } from '../utils.js';

tap.test('Supports --inspect', t => {
  spawn('--inspect server.js', out => {
    if (out.match(/Debugger listening on/)) {
      return out2 => {
        if (out2.match(/touch message.js/)) {
          touchFile('message.js');
          return out3 => {
            if (out3.match(/Restarting/)) {
              return { exit: t.end.bind(t) };
            }
          };
        }
      };
    }
  });
});
