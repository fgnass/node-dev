# node-dev

## v8.0.0 / 2022-12-30

- Suppress experimental warnings in node v18 (@tmont)
- Drop support for node v12, new minimum version of node is v14 (@bjornstar)
- [`devDependencies] Update `@types/node`, `eslint`, `husky`, `lint-staged`, & `tap` (@bjornstar)

## v7.4.3 / 2022-04-17

- [`loaders`] Pass on unsupported extension errors when format is not `builtin` or `commonjs` (@bjornstar)
- [`devDependencies`] Update most devDependencies to their latest versions (@bjornstar)
- [`dependencies`] Update `minimist`, `resolve` & `semver` (@bjornstar)

## v7.4.2 / 2022-03-29

- [wrap] Worker threads inherit node arguments, we only need the main thread to listen for file changes (@lehni)

## v7.4.1 / 2022-03-27

- [`loaders`] Do not attempt to resolve urls unless they are `file://` urls (@bjornstar)

## v7.4.0 / 2022-03-26

- Use `--require` to invoke the wrapper (@kherock)
- [`loaders`] Use `fileURLToPath` to ensure support on Windows (@kherock)
- [`wrap`] Suppress warnings about using experimental loaders (@kherock)
- [`tests`] Ensure tests pass even if warnings are emitted (@bjornstar)
- [CI] Add tests for node v12.10, v12.16, and v17 (@bjornstar)

## v7.3.1 / 2022-03-24

- Add `--experimental-modules` for ESM module support on node <12.17 (@bjornstar)
- Use `ipc.mjs` for `get-source-loader.mjs` (@bjornstar)
- [`test`] Move extensions options tests into their own directory (@bjornstar)

## v7.3.0 / 2022-03-22

- Add `--no-warnings` node option (@lehni)
- Enable ESM support when package type is set to `module` (@lehni)

## v7.2.0 / 2022-03-04

- Add `--preserve-symlinks` node option
- Update `tap` to `v15.1.6`
- Update `eslint` to `v8.10.0`
- [README] Fix typo
- Add a more explicit test for "All command-line arguments that are not node-dev options are passed on to the node process."
- [README] Add special note about delimiting scripts

## v7.1.0 / 2021-10-24

- [ESM] Update `experimental-loader` to use new `load` method from node `v16.12.0` onwards

### Developer Updates

- `@types/node` updated from `v14.14.37` to `v16.11.3`
- `eslint` updated from `v7.25.0` to `v8.0.1`
- `husky` updated from `v6.0.0` to `v7.0.4`
- `lint-staged` updated from `v10.5.4` to `v11.2.3`
- `ts-node` updated from `v9.1.1` to `v10.3.1`
- [CI] Start testing on windows
- [`test/utils`] `touchFile` can take a path
- [`test/typescript`] Use `message.ts` instead of `message.js`

## v7.0.0 / 2021-05-04

- [CLI] Improve command-line parsing, restore support for --require with a space
- [README] Move images into repo and fix URLs
- [dependencies] Update `minimist` from `v1.1.3` to `v1.2.5`
- [.npmignore] Add more config files

### Developer Updates

- [CI] Add github workflows
- [CI] Add appveyor
- [CI] Start testing against node v16
- [CI] Stop testing against node v10
- [`test/spawn`] Split `index` into multiple files
- [`test/utils`] Replaced directory of files with a single module that contains two methods: `spawn` and `touchFile`
- [`test/utils/run`] Moved `run` function directly into the `run` file
- [devDependenies] Update `eslint` from `v7.23.0` to `v7.25.0`

## v6.7.0 / 2021-04-07

- [New Option] `--debounce` to control how long to wait before restarting
- [New Option] `--interval` to adjust the polling interval when enabled
- [`test`] Stop using `tap` aliases
- [`husky`] Migrate from `v4` to `v6`
- [dependencies] Update `semver` from `v7.3.4` to `v7.3.5`
- [devDependencies] Update `@types/node`, `eslint`, `husky`, & `tap`

## v6.6.0 / 2021-03-23

- `--clear` now clears the screen on first start
- `--clear` uses `\u001bc` instead of `\033[2J\033[H`
- [.eslintrc] Add rules for semicolons and whitespace
- [test/cli] Add tests for clear
- [test/spawn] Add tests for clear
- [test/spawn] Move into directory
- [test/utils/spawn] Strip out control char when logging
- [lib/clear] Move clear logic into separate file
- [lib/index] Group similar code

## v6.5.0 / 2021-03-19

- [.npmignore] We can ignore some dotfiles that aren't necessary for the module to function
- [.gitignore] Add `package-lock.json`
- Prefer extracting only the method names from modules that we require, this is a preparatory step for switching to import statements and enables tree shaking.
- Prefer using triple equals instead of double.
- Prefer using arrow functions
- [lib/ignore.js] Move ignore logic into its own file
- [lib/local-path.js] Move local path function into its own file
- [lib/log.js] Convert to ES6
- [lib/notify.js] Convert to ES6
- [test] Finish converting to ES6 style code

## v6.4.0 / 2021-03-02

- Update node-notifier
- Remove the SIGTERM listener when a signal is received so that other listeners don't see ours.

## v6.3.1 / 2021-03-02

- Remove coffeescript tests and dev dependency
- Use eslint:recommended instead of airbnb-base/legacy
- Add prettier
- Add package-lock.json
- Add lint-staged
- Update the README

## v6.3.0 / 2021-02-22

- Stop disconnecting from child processes, this should prevent internal EPIPE errors
- Stop adding filewatchers until child processes have completed exiting
- [IPC] Stop listening on `message`
- [IPC] Remove extraneous `dest` arguments
- [IPC] Add a connected guard on relay
- [Test] Move cluster from `run` to `spawn`
- [Test] Fix typo in cluster test
- [Test] Cluster test now waits for children processes to successfully start up again
- [Test] Add guards to IPC and cluster tests to prevent process exit from ending the test a 2nd time
- [`dependency`] Update `semver` from `v7.3.2 `to `v7.3.4`
- [`devDependency`] Remove `nyc`
- [`devDependency`] Update `@types/node`, `eslint`, `eslint-config-airbnb-base`, `tap`, `ts-node`, & `typescript`
- [`Vagrantfile`] Remove `Vagrantfile`
- [`README`] Fix typo (@ivalsaraj)

## v6.2.0 / 2020-10-15

- Handle multiple values of arguments in command line (Fixes #238)

## v6.1.0 / 2020-10-15

- Manually wrangle node args so that we can handle `--` args coming before `-` args (Fixes #236)

## v6.0.0 / 2020-10-14

- Support ESModules in node v12.11.1+ using `get-source-loader.mjs` and `resolve-loader.mjs` for earlier versions (Fixes #212)
- Pass all unknown arguments to node (Fixes #198)
- Add a test case for typescript using require on the command line
- Add a test case for coffeescript using require on the command line
- Add a test case for `--experimental-specifier-resolution=node`
- Add a test case for `--inspect`
- Add `ts-node/register` as a default extension (Fixes #182)
- [`README.md`] Updated to explain ESModule usage, node arguments, and typescript
- [`test/utils/touch-file`] Now takes the filename as an argument
- [`test/utils/spawn`] Also calls the callback with stderr output

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
  [`README`][readme-ignore-paths] for more details.
- Use [`commander`][npm-commander] for CLI argument parsing instead of custom code.
- Extract [`LICENSE`][license] file.
- Upgrade [`tap`][npm-tap] module to 1.3.2.
- Use [`touch`][npm-touch] module instead of custom code.

[license]: LICENSE
[npm-commander]: https://www.npmjs.com/package/commander
[npm-minimist]: https://www.npmjs.com/package/minimist
[npm-tap]: https://www.npmjs.com/package/tap
[npm-touch]: https://www.npmjs.com/package/touch
[readme]: README.md
[readme-ignore-paths]: README.md#ignore-paths
