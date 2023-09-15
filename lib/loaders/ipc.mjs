const cmd = 'NODE_DEV';

export const send = m => {
  if (process.connected) process.send({ ...m, cmd });
};

export const sendPort = (port, m) => {
  if (port) port.postMessage({ ...m, cmd });
};
