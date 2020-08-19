const NODE_DEV = 'NODE_DEV';

exports.send = function (m, dest) {
  m.cmd = NODE_DEV;
  if (!dest) dest = process;
  if (dest.connected) dest.send(m);
};

exports.on = function (proc, type, cb) {
  function handleMessage(m) {
    if (m.cmd === NODE_DEV && type in m) cb(m);
  }
  proc.on('internalMessage', handleMessage);
  proc.on('message', handleMessage);
};

exports.relay = function (src, dest) {
  if (!dest) dest = process;
  function relayMessage(m) {
    if (m.cmd === NODE_DEV) dest.send(m);
  }
  src.on('internalMessage', relayMessage);
  src.on('message', relayMessage);
};
