'use strict';

const net = require('net'); // for tcp protocol
const Buffer = require('buffer').Buffer; //buffer handling since data send in buffer format
const tracker = require('./tracker'); // all function related to tracker like connect req/res ,announce req/res
const message = require('./message'); // build message

// tcp interface is very similar to using udp, but you have to call the connect method to create a connection before sending any messages

const main= torrent=>{
    tracker.getPeers(torrent, peers => {
        peers.forEach(peer=>handlePeer(peer,torrent));
    });
}

function handlePeer(peer,torrent){
    const socket = net.Socket();
    socket.on('error',console.log);
    socket.connect(peer.port,peer.ip,()=>{
        socket.write(message.buildHandshake(torrent));
    });
    onWholeMsg(socket, msg => msgHandler(msg, socket));
};

function onWholeMsg(socket, callback) {
    let savedBuf = Buffer.alloc(0);
    let handshake = true;
    
    socket.on('data', recvBuf => {
      // msgLen calculates the length of a whole message
      const msgLen = () => handshake ? savedBuf.readUInt8(0) + 49 : savedBuf.readInt32BE(0) + 4;
      savedBuf = Buffer.concat([savedBuf, recvBuf]);
  
      while (savedBuf.length >= 4 && savedBuf.length >= msgLen()) {
        callback(savedBuf.slice(0, msgLen()));
        savedBuf = savedBuf.slice(msgLen());
        handshake = false;
      }
    });
};

function msgHandler(msg, socket) {
    if (isHandshake(msg)) {
      socket.write(message.buildInterested());
    } else {
      const m = message.parse(msg);
  
      if (m.id === 0) chokeHandler();
      if (m.id === 1) unchokeHandler();
      if (m.id === 4) haveHandler(m.payload);
      if (m.id === 5) bitfieldHandler(m.payload);
      if (m.id === 7) pieceHandler(m.payload);
    }
  }

function isHandshake(msg) {
    return msg.length === msg.readUInt8(0) + 49 &&
           msg.toString('utf8', 1, 20) === 'BitTorrent protocol';
};  

function chokeHandler() {
// ...
}

function unchokeHandler() {
// ...
}

function haveHandler() {
// ...
}

function bitfieldHandler() {
// ...
}

function pieceHandler() {
// ...
}

module.exports={
    main,
};
