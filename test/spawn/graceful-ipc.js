const tap = require('tap');

const { spawn, touchFile } = require('../utils');

tap.test('should send IPC message when configured', t => {
  spawn('--graceful_ipc=node-dev:restart ipc-server.js', out => {
    if (out.match(/touch message.js/)) {
      touchFile('message.js');
      let shuttingDown = false;
      return out2 => {
        if (out2.match(/IPC received/) && !shuttingDown) {
          shuttingDown = true;
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});
