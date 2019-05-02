var path = require('path');
var touch = require('touch');

var dir = path.join(__dirname, '..', 'fixture');
var msgFile = path.join(dir, 'message.js');

// Helpers
function touchFile() {
  setTimeout(function () {
    touch(msgFile);
  // filewatcher requires a new mtime to trigger a change event
  // but most file systems only have second precision, so wait
  // one full second before touching.
  }, 1000);
}

module.exports = touchFile;
