const { join } = require('path');
const touch = require('touch');

const dir = join(__dirname, '..', 'fixture');

// filewatcher requires a new mtime to trigger a change event
// but most file systems only have second precision, so wait
// one full second before touching.

module.exports = filename => {
  setTimeout(() => touch(join(dir, filename)), 1000);
};
