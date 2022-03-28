const vm = require('vm');
const { send } = require('../ipc.cjs');

patch(vm, 'createScript', 1);
patch(vm, 'runInThisContext', 1);
patch(vm, 'runInNewContext', 2);
patch(vm, 'runInContext', 2);

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
    if (file) send({ required: file });
    return orig.apply(this, arguments);
  };
}
