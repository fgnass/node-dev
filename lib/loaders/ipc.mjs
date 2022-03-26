const cmd = 'NODE_DEV';

export const send = m => {
  if (process.connected) process.send({ ...m, cmd });
};
