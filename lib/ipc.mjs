const cmd = 'NODE_DEV';

export const send = m => {
  if (process.connected) process.send({ ...m, cmd });
};

export const on = (src, prop, cb) => {
  src.on('internalMessage', m => {
    if (m.cmd === cmd && prop in m) cb(m);
  });
};

export const relay = src => {
  src.on('internalMessage', m => {
    if (process.connected && m.cmd === cmd) process.send(m);
  });
};
