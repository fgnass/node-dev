var spawn = require('./spawn');
var touchFile = require('./touch-file');

function run(cmd, done) {
  return spawn(cmd, function (out) {
    if (out.match(/touch message.js/)) {
      touchFile();
      return function (out2) {
        if (out2.match(/Restarting/)) {
          return { exit: done };
        }
      };
    }
  });
}

module.exports = run;
