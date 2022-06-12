// Source: https://github.com/nodejs/node/issues/30810#issue-533506790

module.exports = p => {
  const { emitWarning, emit } = p;

  p.emitWarning = (warning, ...args) => {
    if (args[0] === 'ExperimentalWarning') {
      return;
    }

    if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') {
      return;
    }

    return emitWarning(warning, ...args);
  };

  const hasMessage = (obj, message) => {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.message === 'string' &&
      obj.message.includes(message)
    );
  };

  // prevent experimental warning message spam on node 18+
  // adapted from https://github.com/yarnpkg/berry/blob/f19f67ef26f004a0b245c81a36158afc45a70504/packages/yarnpkg-pnp/sources/loader/applyPatch.ts#L414-L435
  p.emit = (name, data, ...args) => {
    if (name === 'warning' && hasMessage(data, 'Custom ESM Loaders is an experimental feature')) {
      return false;
    }

    return emit.call(p, name, data, ...args);
  };
};
