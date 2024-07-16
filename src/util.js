'use strict';

const crypto = require('crypto');

let id = null;

const genId = () => {
  if (!id) {
    id = Buffer.alloc(20);
    Buffer.from('-DSC0001-').copy(id, 0); //DSC0-DeepSeaCreature0 001-version1
    crypto.randomBytes(10).copy(id, 8);
  }
  return id;
};

module.exports = {
  genId,
};