import tap from 'tap';

import { spawn, touchFile } from '../utils.js';

tap.test('Restart the cluster', t => {
  if (process.platform === 'win32') {
    t.pass('Restart the cluster', { skip: 'Signals are not supported on Windows' });
    return t.end();
  }

  spawn('cluster.js', out => {
    if (out.match(/touch message\.js/m)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/m)) {
          return out3 => {
            if (out3.match(/All workers disconnected/m)) {
              let shuttingDown = false;
              return out4 => {
                if (out4.match(/touch message\.js/) && !shuttingDown) {
                  shuttingDown = true;
                  return { exit: t.end.bind(t) };
                }
              };
            }
          };
        }
      };
    }
  });
});
