# node-dev

## v5.2.0 / 2020-08-19

- [lib/ipc.js] Do not send unless connected

## v5.1.0 / 2020-07-28

- [wrap.js] Improve uncaughtException handling to turn non-errors into errors (Fixes #231)
- [ipc.js] Declare `NODE_DEV` as a variable
- [ipc.js] Inline single line function only used twice
- [tests] Filenames should be snake-case

## v5.0.0 / 2020-07-08

- Remove `--all-deps` and `--no-deps` CLI options, use `--deps=-1` or `--deps=0` respectively
- Unify `cli` and `cfg` logic to ensure CLI always overrides config files
- Load order for config files now matches what is in the `README`
- Add tests for notify, CLI should override config files
- All config now have clear default values
- Use more ES6 code
- Rename `resolveMain.js` to `resolve-main.js`

## v4.3.0 / 2020-07-03

- Enable `--notify` by default and add tests
- Disable by passing `--notify=false`
- Move cli code out of bin
- Start testing cli interface
- Add bin to lint

## v4.2.0 / 2020-07-03

- No longer sets NODE_ENV to `development`

## v4.1.0 / 2020-07-02

- Update devDependencies:
  - `eslint`: from `v2.0.0` to `v7.3.1`
  - `eslint-config-airbnb-base`: from `v3.0.1` to `v14.2.0`
  - `eslint-plugin-import`: from v`1.8.1` to `v2.22.0`
  - `tap`: from `v12.6.2` to `v14.10.7`
  - `touch`: from `v1.0.0` to `v3.1.0`
- Removed windows restriction for `graceful_ipc`
- No longer attempts to send `SIGTERM` to disconnected child processes
- [package.json] Set minimum node version to 10
- [package.json] Changed test script to be more cross-platform
- [tests] Split tests into 3 separate files
- [tests] Removed a few opportunities for race conditions to occur
- [tests] Some filesystems have single second precision, so tests now wait a minimum of 1 second before touching a file

## v4.0.0 / 2019-04-22

- Update dependencies:
  - dynamic-dedupe: from v0.2.0 to v0.3.0
  - node-notifier: from v4.0.2 to v5.4.0
- Update devDependencies:
  - From coffee-script v1.8.0 to coffeescript v2.4.1
- Add option 'graceful_ipc' for windows children
- Read config from CWD as well as script dir
- Ignore package-lock.json for git and npm
- TravisCI: Test node v6 - 11, stop testing node v5
- Update README for how babel is now packages
- Specify minimum node version as >=6

## v3.1.3 / 2016-05-30

- Update docs
- Fix eslint errors
- Re-enable test for #134

## v3.1.2 / 2016-05-28

- Proof against weird `require.extensions`. See #134.
- Ensure method patching works when filename arguments are missing. See #135.

## v3.1.1 / 2016-05-02

- Enable `--notify` by default again. See #125.
- Support filename option passed to VM methods. Fixes #130.

## v3.1.0 / 2016-02-22

- Add `--no-notify` to disable desktop notifications. See #120.
- Fix `--no-deps` option. See #119.

## v3.0.0 / 2016-01-29

- Add `--respawn` to keep watching after a process exits. See #104.
- Don't terminate the child process if a custom `uncaughtException` handler is registered. See #113.
- Handle `-r` and `--require` node options correctly. See #111.
- Add support for passing options to transpilers. See #109.
- Handle `--no-deps` correctly. See #108.
- Switch to airbnb code style
- Use greenkeeper.io to keep dependencies up to date

## v2.7.1 / 2015-08-21

- Add `--poll` to fix #87
- Switch from [`commander`][npm-commander] to [`minimist`][npm-minimist]
- Fix issues introduced in 2.7.0. See #102 for details.

## v2.7.0 / 2015-08-17

- Support ignoring file paths, e.g. for universal (isomorphic) apps. See
  [`README`][README-ignore-paths] for more details.
- Use [`commander`][npm-commander] for CLI argument parsing instead of custom code.
- Extract [`LICENSE`][LICENSE] file.
- Upgrade [`tap`][npm-tap] module to 1.3.2.
- Use [`touch`][npm-touch] module instead of custom code.

[LICENSE]: LICENSE
[npm-commander]: https://www.npmjs.com/package/commander
[npm-minimist]: https://www.npmjs.com/package/minimist
[npm-tap]: https://www.npmjs.com/package/tap
[npm-touch]: https://www.npmjs.com/package/touch
[README]: README.md
[README-ignore-paths]: README.md#ignore-paths
