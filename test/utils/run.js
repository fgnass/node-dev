const spawn = require('./spawn');
const touchFile = require('./touch-file');

module.exports = (cmd, exit) => {
  return spawn(cmd, out => {
    var touched = false;
    if (!touched && out.match(/touch message\.js/)) {
      touchFile('message.js');
      touched = true;
      return out2 => {
        if (out2.match(/Restarting/)) {
          return { exit };
        }
      };
    }
  });
};
