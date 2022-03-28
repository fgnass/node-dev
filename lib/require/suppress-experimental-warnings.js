// Source: https://github.com/nodejs/node/issues/30810#issue-533506790

const { emitWarning, emit } = process;

process.emitWarning = (warning, ...args) => {
  if (args[0] === 'ExperimentalWarning') {
    return;
  }

  if (args[0] && typeof args[0] === 'object' && args[0].type === 'ExperimentalWarning') {
    return;
  }

  return emitWarning(warning, ...args);
};

process.emit = (...args) => {
  if (args[1]?.name === 'ExperimentalWarning') {
    return;
  }

  return emit.call(process, ...args);
};
