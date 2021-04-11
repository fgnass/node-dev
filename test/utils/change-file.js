const { join } = require('path');
const fs = require('fs');

const dir = join(__dirname, '..', 'fixture');

const replaceInFile = (filePath, from, to) => {
  fs.writeFileSync(filePath, fs.readFileSync(filePath, 'utf-8').replace(from, to));
};

const updateFile = (filename, from, to) => {
  setTimeout(() => replaceInFile(join(dir, filename), from, to), 500);
};

const changeFile = filename => {
  updateFile(filename, 'change', 'revert');
};

const revertFile = filename => {
  updateFile(filename, 'revert', 'change');
};

const revertFileImmediate = filename => {
  replaceInFile(join(dir, filename), 'revert', 'change');
};

module.exports = { changeFile, revertFile, revertFileImmediate };
