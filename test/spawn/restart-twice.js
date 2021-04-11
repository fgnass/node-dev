const tap = require('tap');

const spawn = require('../utils/spawn');
const touchFile = require('../utils/touch-file');

tap.test('should restart the server twice', t => {
  spawn('server.js', out => {
    if (out.match(/touch message.js/)) {
      touchFile('message.js');
      return out2 => {
        if (out2.match(/Restarting/)) {
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
