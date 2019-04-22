# node-dev

## 4.0.0 / 2019-04-22

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

## 3.1.3 / 2016-05-30

- Update docs
- Fix eslint errors
- Re-enable test for #134

## 3.1.2 / 2016-05-28

- Proof against weird `require.extensions`. See #134.
- Ensure method patching works when filename arguments are missing. See #135.

## 3.1.1 / 2016-05-02

- Enable `--notify` by default again. See #125.
- Support filename option passed to VM methods. Fixes #130.

## 3.1.0 / 2016-02-22

- Add `--no-notify` to disable desktop notifications. See #120.
- Fix `--no-deps` option. See #119.

## 3.0.0 / 2016-01-29

- Add `--respawn` to keep watching after a process exits. See #104.
- Don't terminate the child process if a custom `unchaughtException` handler is registered. See #113.
- Handle `-r` and `--require` node options correctly. See #111.
- Add support for passing options to transpilers. See #109.
- Handle `--no-deps` correctly. See #108.
- Switch to airbnb code style
- Use greenkeeper.io to keep dependencies up to date


## 2.7.1 / 2015-08-21

- Add `--poll` to fix #87
- Switch from [`commander`][npm-commander] to [`minimist`][npm-minimist]
- Fix issues introduced in 2.7.0. See #102 for details.

## 2.7.0 / 2015-08-17

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
