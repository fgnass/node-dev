const tap = require('tap');

const cli = require('../lib/cli.js');

tap.test('notify is enabled by default', t => {
  const {
    opts: { notify }
  } = cli(['node', 'bin/node-dev', 'test']);

  t.equal(notify, true);
  t.end();
});

tap.test('--no-notify', t => {
  const {
    opts: { notify }
  } = cli(['node', 'bin/node-dev', '--no-notify', 'test']);

  t.equal(notify, false);
  t.end();
});

tap.test('--notify=false', t => {
  const {
    opts: { notify }
  } = cli(['node', 'bin/node-dev', '--notify=false', 'test']);

  t.equal(notify, false);
  t.end();
});

tap.test('--notify', t => {
  const {
    opts: { notify }
  } = cli(['node', 'bin/node-dev', '--notify', 'test']);

  t.equal(notify, true);
  t.end();
});

tap.test('--notify=true', t => {
  const {
    opts: { notify }
  } = cli(['node', 'bin/node-dev', '--notify=true', 'test']);

  t.equal(notify, true);
  t.end();
});

tap.test('notify can be disabled by .node-dev.json', t => {
  const {
    opts: { notify }
  } = cli(['node', 'bin/node-dev', 'test/fixture/server.js']);

  t.equal(notify, false);
  t.end();
});

tap.test('cli overrides .node-dev.json from false to true', t => {
  const {
    opts: { notify }
  } = cli(['node', 'bin/node-dev', '--notify=true', 'test/fixture/server.js']);

  t.equal(notify, true);
  t.end();
});

tap.test('-r ts-node/register --inspect test/fixture/server.js', t => {
  const argv = 'node bin/node-dev -r ts-node/register --inspect test/fixture/server.js'.split(' ');
  const { nodeArgs } = cli(argv);
  t.same(nodeArgs, ['-r', 'ts-node/register', '--inspect']);
  t.end();
});

tap.test('--inspect -r ts-node/register test/fixture/server.js', t => {
  const argv = 'node bin/node-dev --inspect -r ts-node/register test/fixture/server.js'.split(' ');
  const { nodeArgs } = cli(argv);
  t.same(nodeArgs, ['--inspect', '-r', 'ts-node/register']);
  t.end();
});

tap.test('--expose_gc gc.js foo', t => {
  const argv = 'node bin/node-dev --expose_gc test/fixture/gc.js test/fixture/foo'.split(' ');
  const { nodeArgs } = cli(argv);
  t.same(nodeArgs, ['--expose_gc']);
  t.end();
});

tap.test('clear is not enabled by default', t => {
  const {
    opts: { clear }
  } = cli(['node', 'bin/node-dev', 'test']);

  t.notOk(clear);
  t.end();
});

tap.test('--clear enables clear', t => {
  const {
    opts: { clear }
  } = cli(['node', 'bin/node-dev', '--clear', 'test']);

  t.ok(clear);
  t.end();
});

tap.test('interval default', t => {
  const {
    opts: { interval }
  } = cli(['node', 'bin/node-dev', 'test']);

  t.equal(interval, 1000);
  t.end();
});

tap.test('--interval=2000', t => {
  const {
    opts: { interval }
  } = cli(['node', 'bin/node-dev', '--interval=2000', 'test']);

  t.equal(interval, 2000);
  t.end();
});

tap.test('debounce default', t => {
  const {
    opts: { debounce }
  } = cli(['node', 'bin/node-dev', 'test']);

  t.equal(debounce, 10);
  t.end();
});

tap.test('--debounce=2000', t => {
  const {
    opts: { debounce }
  } = cli(['node', 'bin/node-dev', '--debounce=2000', 'test']);

  t.equal(debounce, 2000);
  t.end();
});
