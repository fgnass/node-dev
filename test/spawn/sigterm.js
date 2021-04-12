const tap = require('tap');

const { spawn, touchFile } = require('../utils');

tap.test('should allow graceful shutdowns', t => {
  if (process.platform === 'win32') {
    t.pass('should allow graceful shutdowns', { skip: 'Signals are not supported on Windows' });
    t.end();
  } else {
    spawn('server.js', out => {
      if (out.match(/touch message.js/)) {
        touchFile('message.js');
        return out2 => {
          if (out2.match(/exit/)) {
            return { exit: t.end.bind(t) };
          }
        };
      }
    });
  }
});
