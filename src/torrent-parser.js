'use strict';

const fs = require('fs'); // file handling
const bncode = require('bncode'); // bencode encoding/decoding
const crypto = require('crypto'); // for hashing/encryption/decription
const BigNumber = require('bignumber.js'); // to handle arbitrary precision big numbers

const open = (filepath) => {
    return bncode.decode(fs.readFileSync(filepath));
};

const size = torrent => {
    const size = torrent.info.files ?
        torrent.info.files.map(file => new BigNumber(file.length)).reduce((a, b) => a.plus(b)) :
        new BigNumber(torrent.info.length);

    // Convert size to an 8-byte buffer
    const sizeBuffer = Buffer.alloc(8);
    sizeBuffer.writeBigUInt64BE(BigInt(size.toFixed())); // Ensure the number fits in 8 bytes
    return sizeBuffer;
};

const infoHash = torrent => {
    const info = bncode.encode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
};

module.exports = {
    open,
    size,
    infoHash
};
