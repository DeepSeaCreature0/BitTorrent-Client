'use strict';

const tp = require('./torrent-parser');

module.exports = class {
  constructor(torrent) {
    this._torrent = torrent;
    this._queue = [];
    this.choked = true;
  }

  queue(pieceIndex) {
    const nBlocks = tp.blocksPerPiece(this._torrent, pieceIndex);

    const ln_s = tp.blockLen(this._torrent, pieceIndex, 0); // length of all blocks except last block
    const ln_e = tp.blockLen(this._torrent, pieceIndex, nBlocks-1); //last block length

    for (let i = 0; i < nBlocks; i++) {
      const pieceBlock = {
        index: pieceIndex,
        begin: i * tp.BLOCK_LEN,
        length: (i==nBlocks-1)?ln_e:ln_s
      };
      this._queue.push(pieceBlock);
    }
  }

  deque() { return this._queue.shift(); }

  peek() { return this._queue[0]; }

  length() { return this._queue.length; }
};