const fs = require('fs');
const crypto = require('crypto');

const contentMap = {};

const getFileHash = (srcPath, cb) => {
  const stream = fs.createReadStream(srcPath);
  const md5sum = crypto.createHash('md5');
  stream.on('data', data => md5sum.update(data));
  stream.on('error', cb).on('close', () => {
    cb(null, md5sum.digest('hex'));
  });
};

const getFileHashCaught = (file, hashCb) => {
  getFileHash(file, (err, hash) => {
    if (!err) {
      hashCb(hash);
    } else {
      console.error('Error getting file hash:', err);
      hashCb(null);
    }
  });
};

const clearContentMap = () => {
  Object.keys(contentMap).forEach(key => delete contentMap[key]);
};

const checkContentChanged = (file, changedCb) => {
  getFileHashCaught(file, hash => {
    const currentHash = contentMap[file];
    if (hash) {
      contentMap[file] = hash;
      changedCb(currentHash !== hash);
    } else {
      changedCb(true);
    }
  });
};

const addToContentMap = file => {
  getFileHashCaught(file, hash => {
    if (hash) contentMap[file] = hash;
  });
};

module.exports = { addToContentMap, checkContentChanged, clearContentMap };
