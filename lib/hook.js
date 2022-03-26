const vm = require('vm');

module.exports = (patchVM, callback) => {
  // Hook into Node's `require(...)`
  updateHooks();

  // Patch the vm module to watch files executed via one of these methods:
  if (patchVM) {
    patch(vm, 'createScript', 1);
    patch(vm, 'runInThisContext', 1);
    patch(vm, 'runInNewContext', 2);
    patch(vm, 'runInContext', 2);
  }

  /**
   * Patch the specified method to watch the file at the given argument
   * index.
   */
  function patch(obj, method, optionsArgIndex) {
    const orig = obj[method];
    if (!orig) return;
    obj[method] = function () {
      const opts = arguments[optionsArgIndex];
      let file = null;
      if (opts) {
        file = typeof opts === 'string' ? opts : opts.filename;
      }
      if (file) callback(file);
      return orig.apply(this, arguments);
    };
  }

  /**
   * (Re-)install hooks for all registered file extensions.
   */
  function updateHooks() {
    Object.keys(require.extensions).forEach(ext => {
      const fn = require.extensions[ext];
      if (typeof fn === 'function' && fn.name !== 'nodeDevHook') {
        require.extensions[ext] = createHook(fn);
      }
    });
  }

  /**
   * Returns a function that can be put into `require.extensions` in order to
   * invoke the callback when a module is required for the first time.
   */
  function createHook(handler) {
    return function nodeDevHook(module, filename) {
      if (!module.loaded) callback(module.filename);

      // Invoke the original handler
      handler(module, filename);

      // Make sure the module did not hijack the handler
      updateHooks();
    };
  }
};
