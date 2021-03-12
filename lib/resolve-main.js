const { sync: resolve } = require('resolve');

module.exports = main => {
  const basedir = process.cwd();
  const paths = [basedir];
  return resolve(main, { basedir, paths });
};
