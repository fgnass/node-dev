const tap = require('tap');

const cli = require('../lib/cli.js');

tap.test('notify is enabled by default', t => {
  const { opts: { notify } } = cli(['node', 'bin/node-dev', 'test']);

  t.is(notify, true);
  t.done();
});

tap.test('--no-notify', t => {
  const { opts: { notify } } = cli(['node', 'bin/node-dev', '--no-notify', 'test']);

  t.is(notify, false);
  t.done();
});

tap.test('--notify=false', t => {
  const { opts: { notify } } = cli(['node', 'bin/node-dev', '--notify=false', 'test']);

  t.is(notify, false);
  t.done();
});

tap.test('--notify', t => {
  const { opts: { notify } } = cli(['node', 'bin/node-dev', '--notify', 'test']);

  t.is(notify, true);
  t.done();
});

tap.test('--notify=true', t => {
  const { opts: { notify } } = cli(['node', 'bin/node-dev', '--notify=true', 'test']);

  t.is(notify, true);
  t.done();
});

tap.test('notify can be disabled by .node-dev.json', t => {
  const { opts: { notify } } = cli(['node', 'bin/node-dev', 'test/fixture/server.js']);

  t.is(notify, false);
  t.done();
});

tap.test('cli overrides .node-dev.json from false to true', t => {
  const { opts: { notify } } = cli(['node', 'bin/node-dev', '--notify=true', 'test/fixture/server.js']);

  t.is(notify, true);
  t.done();
});
