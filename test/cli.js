const tap = require('tap');

const cli = require('../lib/cli.js');

tap.test('notify is enabled by default', t => {
  const { opts: { notify } } = cli([]);

  t.is(notify, true);
  t.done();
});

tap.test('notify can be disabled', t => {
  const { opts: { notify } } = cli(['node', 'bin/node-dev', '--notify=false', 'foo.js']);

  t.is(notify, false);
  t.done();
});
