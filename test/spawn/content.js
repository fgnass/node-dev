const tap = require('tap');

const { spawn, touchFile } = require('../utils');
const { changeFile, revertFile, revertFileImmediate } = require('../change-file');

tap.test('should not restart with --content on file touch', t => {
  const ps = spawn('--content server.js', out => {
    if (out.match(/touch message.js/)) {
      touchFile('message-content.js');
      const exitTimeout = setTimeout(() => {
        ps.kill('SIGTERM');
        t.end();
      }, 1500);
      return out2 => {
        clearTimeout(exitTimeout);
        if (out2.match(/Restarting/)) {
          return { exit: t.fail.bind(t) };
        } else {
          return { exit: t.end.bind(t) };
        }
      };
    }
  });
});

tap.test('should restart the server with --content twice', t => {
  revertFileImmediate('message-content.js');
  spawn('--content server.js', out => {
    console.log('out', out);
    if (out.match(/change message-content.js/)) {
      changeFile('message-content.js');
      return out2 => {
        console.log('out2', out2);
        if (out2.match(/Restarting/)) {
          revertFile('message-content.js');
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
