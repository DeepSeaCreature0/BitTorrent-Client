'use strict';

const fs = require('fs');
const bncode = require('bncode');

module.exports.open = (filepath) => {
  return bncode.decode(fs.readFileSync(filepath));
};

module.exports.size = torrent => {
  // ...
};

module.exports.infoHash = torrent => {
  // ...
};