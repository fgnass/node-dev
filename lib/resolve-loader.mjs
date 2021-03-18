import ipc from './ipc.js';

const { send } = ipc;

export function resolve(specifier, parentModule, defaultResolve) {
  const resolved = defaultResolve(specifier, parentModule);

  if (parentModule) {
    send({ required: new URL(resolved.url).pathname });
  }

  return resolved;
}
