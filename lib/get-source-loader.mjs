import ipc from './ipc.js';

export async function getSource(url, context, defaultGetSource) {
  ipc.send({ required: new URL(url).pathname });
  return defaultGetSource(url, context, defaultGetSource);
}
