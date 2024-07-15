'use strict';

const fs = require('fs');
const bncode = require('bncode');
const crypto = require('crypto');
const BigNumber = require('bignumber.js');

module.exports.open = (filepath) => {
  return bncode.decode(fs.readFileSync(filepath));
};

module.exports.size = torrent => {
  const size = torrent.info.files ?
    torrent.info.files.map(file => new BigNumber(file.length)).reduce((a, b) => a.plus(b)) :
    new BigNumber(torrent.info.length);

  // Convert size to an 8-byte buffer
  const sizeBuffer = Buffer.alloc(8);
  sizeBuffer.writeBigUInt64BE(BigInt(size.toFixed()));
  return sizeBuffer;
};

module.exports.infoHash = torrent => {
  const info = bncode.encode(torrent.info);
  return crypto.createHash('sha1').update(info).digest();
};
