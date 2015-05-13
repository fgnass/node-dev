var fs = require('fs')
var path = require('path')

function read(dir) {
  var f = path.resolve(dir, '.node-dev.json')
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f)) : null
}

module.exports = function(main, opts) {
  var dir = main ? path.dirname(main) : '.'
  var c = read(dir)

  if(c==null && dir!='.'){
    dir = path.dirname('.');
    c = read(dir);
  }
  if(c==null){
    c={}
  }
  c.__proto__ = read(process.env.HOME || process.env.USERPROFILE)

  // Truthy == --all-deps, false: one level of deps
  if (typeof c.deps != 'number') c.deps = c.deps ? -1 : 1
  if (c.ignores && Array.isArray(c.ignores)) {
    var length = c.ignores.length;
    for(var i=0;i<length;i++){
      c.ignores[i] = path.resolve( dir, c.ignores[i])
    }
  }else{
    c.ignores = []
  }

  if (opts) {
    // Overwrite with CLI opts ...
    if (opts.allDeps) c.deps = -1
    if (opts.noDeps) c.deps = 0
    if (opts.dedupe) c.dedupe = true
  }

  return {
    vm         : c.vm !== false,
    fork       : c.fork !== false,
    notify     : c.notify !== false,
    deps       : c.deps,
    ignores    : c.ignores,
    timestamp  : c.timestamp || (c.timestamp !== false && 'HH:MM:ss'),
    clear      : !!c.clear,
    dedupe     : !!c.dedupe,
    extensions : c.extensions || {
      coffee: "coffee-script/register",
      ls: "LiveScript"
    }
  }
}
