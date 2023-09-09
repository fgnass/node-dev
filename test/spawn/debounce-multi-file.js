const tap = require('tap');

const { spawn, touchFile } = require('../utils');

tap.test('should reset debounce timer if a different file changes', t => {
  spawn('--debounce=1000 --interval=50 server.js', out => {
    if (out.match(/touch message.js/)) {
      const ts = Date.now();
      touchFile('server.js');
      for (let i = 0; i <= 2000; i += 500) {
        setTimeout(() => {
          touchFile('message.js');
        }, i);
      }
      return out2 => {
        if (out2.match(/Restarting/)) {
          if (Date.now() - ts < 2500) {
            t.fail('Debounce logic did not wait 200 ms after the second change.');
          }
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});
