import tap from 'tap';

import cli from '../lib/cli.js';

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
  t.same(nodeArgs, ['--inspect', '--require=ts-node/register']);
  t.end();
});

tap.test('--inspect -r ts-node/register test/fixture/server.js', t => {
  const argv = 'node bin/node-dev --inspect -r ts-node/register test/fixture/server.js'.split(' ');
  const { nodeArgs } = cli(argv);
  t.same(nodeArgs, ['--inspect', '--require=ts-node/register']);
  t.end();
});

tap.test('--expose_gc gc.js foo', t => {
  const argv = 'node bin/node-dev --expose_gc test/fixture/gc.js foo'.split(' ');
  const { nodeArgs } = cli(argv);
  t.same(nodeArgs, ['--expose_gc']);
  t.end();
});

tap.test('--preserve-symlinks test', t => {
  const argv = 'node bin/node-dev --preserve-symlinks test'.split(' ');
  const { nodeArgs } = cli(argv);
  t.same(nodeArgs, ['--preserve-symlinks']);
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

tap.test('--require source-map-support/register', t => {
  const { nodeArgs } = cli([
    'node',
    'bin/node-dev',
    '--require',
    'source-map-support/register',
    'test'
  ]);

  t.same(nodeArgs, ['--require=source-map-support/register']);
  t.end();
});

tap.test('--require=source-map-support/register', t => {
  const { nodeArgs } = cli([
    'node',
    'bin/node-dev',
    '--require=source-map-support/register',
    'test'
  ]);

  t.same(nodeArgs, ['--require=source-map-support/register']);
  t.end();
});

tap.test('-r source-map-support/register', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '-r', 'source-map-support/register', 'test']);

  t.same(nodeArgs, ['--require=source-map-support/register']);
  t.end();
});

tap.test('-r=source-map-support/register', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '-r=source-map-support/register', 'test']);

  t.same(nodeArgs, ['--require=source-map-support/register']);
  t.end();
});

tap.test('--inspect=127.0.0.1:12345', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '--inspect=127.0.0.1:12345', 'test']);

  t.same(nodeArgs, ['--inspect=127.0.0.1:12345']);
  t.end();
});

tap.test('--inspect', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '--inspect', 'test']);

  t.same(nodeArgs, ['--inspect']);
  t.end();
});

tap.test('--no-warnings', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '--no-warnings', 'test']);

  t.same(nodeArgs, ['--no-warnings']);
  t.end();
});

tap.test('--require source-map-support/register --require ts-node/register', t => {
  const { nodeArgs } = cli([
    'node',
    'bin/node-dev',
    '--require',
    'source-map-support/register',
    '--require',
    'ts-node/register',
    'test'
  ]);

  t.same(nodeArgs, ['--require=source-map-support/register', '--require=ts-node/register']);
  t.end();
});

// This should display usage information at some point
tap.test('No script or option should fail', t => {
  t.throws(() => cli(['node', 'bin/node-dev']));
  t.end();
});

tap.test('Just an option should fail', t => {
  t.throws(() => cli(['node', 'bin/node-dev', '--option']));
  t.end();
});

tap.test('Just an option with a value should fail', t => {
  t.throws(() => cli(['node', 'bin/node-dev', '--option=value']));
  t.end();
});

tap.test('An unknown argument with a value instead of a script should fail.', t => {
  t.throws(() => cli(['node', 'bin/node-dev', '--unknown-arg', 'value']));
  t.end();
});

tap.test('An unknown argument with a value', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '--unknown-arg=value', 'test']);

  t.same(nodeArgs, ['--unknown-arg=value']);
  t.end();
});

tap.test('An unknown argument without a value can use -- to delimit', t => {
  // use -- to delimit the end of options
  const { nodeArgs } = cli(['node', 'bin/node-dev', '--unknown-arg', '--', 'test']);

  t.same(nodeArgs, ['--unknown-arg']);
  t.end();
});

tap.test('Single dash with value', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '-u', 'value', 'test']);

  t.same(nodeArgs, ['-u=value']);
  t.end();
});

tap.test('Single dash with = and value', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '-u=value', 'test']);

  t.same(nodeArgs, ['-u=value']);
  t.end();
});

tap.test('Single dash without value should fail', t => {
  t.throws(() => cli(['node', 'bin/node-dev', '-u', 'test']));
  t.end();
});

tap.test('Single dash without value can use -- to delimit', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '-u', '--', 'test']);

  t.same(nodeArgs, ['-u']);
  t.end();
});

tap.test('Repeated single dash', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '-u=value1', '-u=value2', 'test']);

  t.same(nodeArgs, ['-u=value1', '-u=value2']);
  t.end();
});

tap.test('Repeated single dash without =', t => {
  const { nodeArgs } = cli(['node', 'bin/node-dev', '-u', 'value1', '-u', 'value2', 'test']);

  t.same(nodeArgs, ['-u=value1', '-u=value2']);
  t.end();
});

tap.test(
  'All command-line arguments that are not `node-dev` options are passed on to the `node` process.',
  t => {
    // Everything except clear gets passed to node.
    // Don't forget to use -- to delimit!
    const argv =
      'node bin/node-dev --all --command-line --arguments --clear --that --are --not --node-dev --options -- test'.split(
        ' '
      );
    const { nodeArgs } = cli(argv);

    t.same(nodeArgs, [
      '--all',
      '--command-line',
      '--arguments',
      '--that',
      '--are',
      '--not',
      '--node-dev',
      '--options'
    ]);
    t.end();
  }
);
