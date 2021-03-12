import { send } from './ipc.js';

export function resolve(specifier, parentModule, defaultResolve) {
  const resolved = defaultResolve(specifier, parentModule);

  if (parentModule) {
    send({ required: new URL(resolved.url).pathname });
  }

  return resolved;
}
