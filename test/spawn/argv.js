const tap = require('tap');

const { spawn } = require('../utils');

tap.test('should not show up in argv', t => {
  spawn('argv.js foo', out => {
    const argv = JSON.parse(out.replace(/'/g, '"'));
    t.match(argv[0], /.*?node(js|\.exe)?$/);
    t.match(argv[1], /.*[\\/]argv\.js$/);
    t.equal(argv[2], 'foo');
    return { exit: t.end.bind(t) };
  });
});
