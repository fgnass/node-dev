const NODE_DEV = 'NODE_DEV';

exports.send = function (m) {
  m.cmd = NODE_DEV;
  process.send(m);
};

exports.on = function (proc, type, cb) {
  function handleMessage(m) {
    if (m.cmd === NODE_DEV && type in m) cb(m);
  }
  proc.on('internalMessage', handleMessage);
};

exports.relay = function (src) {
  function relayMessage(m) {
    if (m.cmd === NODE_DEV) {
      process.send(m);
    }
  }
  src.on('internalMessage', relayMessage);
};
