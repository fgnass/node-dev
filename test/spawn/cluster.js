const tap = require('tap');

const { spawn, touchFile } = require('../utils');

tap.test('Restart the cluster', t => {
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
