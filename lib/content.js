const fs = require('fs');
const crypto = require('crypto');

const contentMap = {};

const getFileHash = file => {
  const text = fs.readFileSync(file, 'utf-8');
  return crypto.createHash('md5').update(text).digest('hex');
};

const clearContentMap = () => {
  Object.keys(contentMap).forEach(key => delete contentMap[key]);
};

const checkContentChanged = file => {
  const hash = getFileHash(file);
  const currentHash = contentMap[file];
  contentMap[file] = hash;
  return hash !== currentHash;
};

module.exports = { checkContentChanged, clearContentMap };
