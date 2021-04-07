const fs = require('fs');
const crypto = require('crypto');

const contentMap = {};

const getTextHash = text => crypto.createHash('md5').update(text).digest('hex');

const getFileHash = file => {
  const text = fs.readFileSync(file, 'utf-8');
  return getTextHash(text);
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

const addToContentMap = file => {
  fs.readFile(file, 'utf-8', (err, text) => {
    if (!err) {
      contentMap[file] = getTextHash(text);
    }
  });
};

module.exports = { addToContentMap, checkContentChanged, clearContentMap };
