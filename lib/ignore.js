const n = 'node_modules';

/**
 * Returns the nesting-level of the given module.
 * Will return 0 for modules from the main package or linked modules,
 * a positive integer otherwise.
 */
const getLevel = mod => getPrefix(mod).split(n).length - 1;

/**
 * Returns the path up to the last occurence of `node_modules` or an
 * empty string if the path does not contain a node_modules dir.
 */
const getPrefix = mod => {
  const i = mod.lastIndexOf(n);
  return i !== -1 ? mod.slice(0, i + n.length) : '';
};

const isPrefixOf = value => prefix => value.startsWith(prefix);

const configureDeps = deps => required => deps !== -1 && getLevel(required) > deps;
const configureIgnore = ignore => required => ignore.some(isPrefixOf(required));

module.exports = { configureDeps, configureIgnore };
