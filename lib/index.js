var fork = require('child_process').fork
  , fs = require('fs')
  , ipc = require('./ipc')
  , notify = require('./notify')
  , cfg = require('./cfg')

module.exports = function(args) {

  // The child_process
  var child

  // Find the first arg that is not an option
  for (var i=0; i < args.length; i++) {
    if (!/^-/.test(args[i])) {
      // Splice wrap.js into the argument list
      args.splice(i, 0, __dirname + '/wrap.js')
      break
    }
  }

  var watchers = {}
  var start_time

  function mk_change(file) {
    return function(ev) {

      // avoids an issue seen on OSX where atime caused restarts
      // but atime doesn't matter
      var stat = fs.statSync(file)
      if (start_time && stat.mtime && stat.mtime < start_time) {
        return
      }

      if (cfg.clear) process.stdout.write('\033[2J\033[H')
      notify('Restarting', file + ' has been modified')
      watchers[file].close()
      stop();
    }
  }

  /**
   * Run the wrapped script.
   */
  function start() {
    child = fork(args[0], args.slice(1), {
      cwd: process.cwd(),
      env: process.env
    })
    .on('exit', function(code) {
      if (!child.respawn) process.exit(code)
      child = undefined

      // close current watchers, newly launched program may have different files
      Object.keys(watchers).forEach(function(filename) {
        watchers[filename].close()
      })
      watchers = {}
      setImmediate(start)
    })

    start_time = new Date()

    // Listen for `required` messages and watch the required file.
    ipc.on(child, 'required', function(m) {
      var filename = m.required
      // only watch once
      if (filename in watchers) {
        return
      }

      var watcher = fs.watch(filename, mk_change(filename))
      watchers[filename] = watcher
    })

    // Upon errors, display a notification and tell the child to exit.
    ipc.on(child, 'error', function(m) {
      notify(m.error, m.message, 'error')
      stop()
    })
  }

  function stop() {
    child.respawn = true
    ipc.send({exit: true}, child)
  }

  // Relay SIGTERM
  process.on('SIGTERM', function() {
    if (child) child.kill('SIGTERM')
    process.exit(0)
  })

  start()
}
