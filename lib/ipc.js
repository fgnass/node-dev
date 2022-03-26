const cmd = 'NODE_DEV';

exports.on = (src, prop, cb) => {
  src.on('internalMessage', m => {
    if (m.cmd === cmd && prop in m) cb(m);
  });
};

exports.relay = src => {
  src.on('internalMessage', m => {
    if (process.connected && m.cmd === cmd) process.send(m);
  });
};

exports.send = m => {
  if (process.connected) process.send({ ...m, cmd });
};
