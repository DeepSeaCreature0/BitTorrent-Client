'use strict';

const dgram = require('dgram'); // for udp protocol
const Buffer = require('buffer').Buffer; //buffer handling since data send in buffer format
const { URL } = require('url') // hanling url like slicing host/port from url
const crypto = require('crypto'); // encryption/decryption/hashing
const torrentParser = require('./torrent-parser'); // torrent handling like open,torrent-size,hashing of info
const util = require('./util'); // generating unique id for our client

// get the list of all the peers from the torrent and fire the callback function
const getPeers = (torrent, callback) => {
  const socket = dgram.createSocket('udp4');  //socket for udp connection
  const url = torrent.announce.toString('utf8');  //tracker's url

  // 1. send connect request
  // 2. receive and parse connect response
  // 3. send announce request
  // 4. receive and parse announce response

  udpSend(socket, buildConnReq(), url); // step-1 send

  /*
    syntex socket.on(event,callback);
    message:-   event emitted when UDP socket recieves a message;
    response:-  buffer containing the data received from the message from tracker 
  */
  socket.on('message', response => { // step-2/4 receive 
    if (respType(response) === 'connect') {
      
      const connResp = parseConnResp(response); // step-2 parse
      
      const announceReq = buildAnnounceReq(connResp.connectionId, torrent); // parse announce request
      udpSend(socket, announceReq, url); // step-3 send

    } else if (respType(response) === 'announce') {
      
      const announceResp = parseAnnounceResp(response); // step-4 parse
      // 5. pass peers to callback
      callback(announceResp.peers);
    }
  });
};

function udpSend(socket, message, rawUrl, callback=()=>{}) {
  const url = new URL(rawUrl);
  // arguments(message buffer,offset,message length,tracker's port,tracker's hostname,callback function)
  socket.send(message, 0, message.length, url.port, url.hostname, callback);
}

function respType(resp) {
    const action = resp.readUInt32BE(0);
    if (action === 0) return 'connect';
    if (action === 1) return 'announce';
}
/*
  connect request:

  Offset  Size            Name            Value
  0       64-bit integer  protocol_id     0x41727101980 // magic constant
  8       32-bit integer  action          0 // connect
  12      32-bit integer  transaction_id
  16
*/
//  parse connect request into buffer 
function buildConnReq() {
  const buf = Buffer.allocUnsafe(16);

  // connection id 
  // buf.writeUInt32BE(0x417, 0);
  // buf.writeUInt32BE(0x27101980, 4);
  buf.writeBigUInt64BE(BigInt('0x41727101980'), 0);

  // action 
  buf.writeUInt32BE(0, 8);

  // transaction id 
  crypto.randomBytes(4).copy(buf, 12);

  return buf;
}
/*
  connect response:

  Offset  Size            Name            Value
  0       32-bit integer  action          0 // connect
  4       32-bit integer  transaction_id
  8       64-bit integer  connection_id
  16
*/
// parse connect response
function parseConnResp(resp) {
  // return a dictionary
  return {
    action: resp.readUInt32BE(0), 
    transactionId: resp.readUInt32BE(4), // should be same as the corresponding connect request transaction_id
    connectionId: resp.slice(8) 
  }
}
/*
  IPv4 announce request:

  Offset  Size    Name    Value
  0       64-bit integer  connection_id
  8       32-bit integer  action          1 // announce
  12      32-bit integer  transaction_id
  16      20-byte string  info_hash
  36      20-byte string  peer_id
  56      64-bit integer  downloaded
  64      64-bit integer  left
  72      64-bit integer  uploaded
  80      32-bit integer  event           0 // 0: none; 1: completed; 2: started; 3: stopped
  84      32-bit integer  IP address      0 // default
  88      32-bit integer  key
  92      32-bit integer  num_want        -1 // default
  96      16-bit integer  port
  98
*/
// parse announce request into buffer
function buildAnnounceReq(connId, torrent, port=6881) {
  const buf = Buffer.allocUnsafe(98);

  // connection id 
  connId.copy(buf, 0);
  // action 
  buf.writeUInt32BE(1, 8);
  // transaction id 
  crypto.randomBytes(4).copy(buf, 12);
  // info hash 
  torrentParser.infoHash(torrent).copy(buf, 16);
  // peerId
  util.genId().copy(buf, 36);
  // downloaded
  Buffer.alloc(8).copy(buf, 56);
  // left
  torrentParser.size(torrent).copy(buf, 64);
  // uploaded
  Buffer.alloc(8).copy(buf, 72);
  // event
  buf.writeUInt32BE(0, 80);
  // ip address
  buf.writeUInt32BE(0, 84);
  // key
  crypto.randomBytes(4).copy(buf, 88);
  // num want
  buf.writeInt32BE(-1, 92);
  // port
  buf.writeUInt16BE(port, 96);

  return buf;
}

/*
  IPv4 announce response:

  Offset      Size            Name            Value
  0           32-bit integer  action          1 // announce
  4           32-bit integer  transaction_id
  8           32-bit integer  interval
  12          32-bit integer  leechers
  16          32-bit integer  seeders
  20 + 6 * n  32-bit integer  IP address
  24 + 6 * n  16-bit integer  TCP port
  20 + 6 * N
*/
// parse announce response
function parseAnnounceResp(resp) {
  function group(iterable, groupSize) { // Divides a buffer into smaller buffers of a specified size.
    let groups = [];
    for (let i = 0; i < iterable.length; i += groupSize) {
      groups.push(iterable.slice(i, i + groupSize));
    }
    return groups;
  }

  return {
    action: resp.readUInt32BE(0),
    transactionId: resp.readUInt32BE(4),
    leechers: resp.readUInt32BE(8),
    seeders: resp.readUInt32BE(12),
    /*
      Size: Each peer entry is 6 bytes
      IP address: 32 bits (4 bytes)
      TCP port: 16 bits (2 bytes)
    */
    peers: group(resp.slice(20), 6).map(address => { 
      return {
        ip: address.slice(0, 4).join('.'),
        port: address.readUInt16BE(4)
      }
    })
  }
}

module.exports={
  getPeers,
};