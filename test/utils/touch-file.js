const path = require('path');
const touch = require('touch');

const dir = path.join(__dirname, '..', 'fixture');

// filewatcher requires a new mtime to trigger a change event
// but most file systems only have second precision, so wait
// one full second before touching.

module.exports = filename => {
  setTimeout(() => touch(path.join(dir, filename)), 1000);
};
