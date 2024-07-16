'use strict';

const net = require('net'); // for tcp protocol
const Buffer = require('buffer').Buffer; //buffer handling since data send in buffer format
const tracker =require('./tracker'); // all function related to tracker like connect req/res ,announce req/res

// tcp interface is very similar to using udp, but you have to call the connect method to create a connection before sending any messages

const main= torrent=>{
    tracker.getPeers(torrent, peers => {
        peers.forEach(handlePeer);
    });
}

function handlePeer(peer){
    const socket = net.Socket();
    socket.on('error',console.log);
    socket.connect(peer.port,peer.ip,()=>{
        // message
    });
    onWholeMsg(socket, data => {
        // handle response here
    });
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
  }

module.exports={
    main,
};
