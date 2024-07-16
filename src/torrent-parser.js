'use strict';

const fs = require('fs'); // file handling
const bncode = require('bncode'); // bencode encoding/decoding
const crypto = require('crypto'); // for hashing/encryption/decryption
const BigNumber = require('bignumber.js'); // to handle arbitrary precision big numbers

const BLOCK_LEN = Math.pow(2, 14);

const open = (filepath) => {
    return bncode.decode(fs.readFileSync(filepath));
};

const size = torrent => {
    const totalSize = torrent.info.files ?
        torrent.info.files.map(file => new BigNumber(file.length)).reduce((a, b) => a.plus(b), new BigNumber(0)) :
        new BigNumber(torrent.info.length);

    // Convert size to an 8-byte buffer
    const sizeBuffer = Buffer.alloc(8);
    sizeBuffer.writeBigUInt64BE(BigInt(totalSize.toFixed())); // Ensure the number fits in 8 bytes
    return sizeBuffer;
};

const infoHash = torrent => {
    const info = bncode.encode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
};

const pieceLen = (torrent, pieceIndex) => {
    const totalLength = new BigNumber(size(torrent).toString('hex'), 16).toNumber();
    const pieceLength = torrent.info['piece length'];
  
    const lastPieceLength = totalLength % pieceLength;
    const lastPieceIndex = Math.floor(totalLength / pieceLength);
  
    return lastPieceIndex === pieceIndex ? lastPieceLength : pieceLength;
};

const blocksPerPiece = (torrent, pieceIndex) => {
    const pieceLength = pieceLen(torrent, pieceIndex);
    return Math.ceil(pieceLength / BLOCK_LEN);
};

const blockLen = (torrent, pieceIndex, blockIndex) => {
    const pieceLength = pieceLen(torrent, pieceIndex);
  
    const lastBlockLength = pieceLength % BLOCK_LEN;
    const lastBlockIndex = Math.floor(pieceLength / BLOCK_LEN);
  
    return blockIndex === lastBlockIndex ? lastBlockLength : BLOCK_LEN;
};

module.exports = {
    open,
    size,
    infoHash,
    BLOCK_LEN,
    pieceLen,
    blocksPerPiece,
    blockLen,
};
