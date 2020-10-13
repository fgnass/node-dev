import ipc from './ipc.js';

export function resolve(specifier, parentModule, defaultResolve) {
  const resolved = defaultResolve(specifier, parentModule);

  if (parentModule) {
    ipc.send({ required: new URL(resolved.url).pathname });
  }

  return resolved;
}
