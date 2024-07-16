'use strict';

const net = require('net'); // for tcp protocol
const Buffer = require('buffer').Buffer; //buffer handling since data send in buffer format
const tracker =require('./tracker'); // all function related to tracker like connect req/res ,announce req/res

// tcp interface is very similar to using udp, but you have to call the connect method to create a connection before sending any messages

const main= torrent=>{
    tracker.getPeers(torrent, peers => {
        peers.forEach(downloadFromPeer);
    });
}

function downloadFromPeer(peer){
    const socket =net.Socket();
    socket.on('error',console.log);
    socket.connect(peer.port,peer.ip,()=>{
        // message
    });
    socket.on('data',data=>{
        // handle response
    });
};

module.exports={
    main,
};
