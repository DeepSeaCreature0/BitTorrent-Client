'use strict'; //enforces stricter parsing and error handling

const tracker = require('./tracker'); // all function related to tracker like connect req/res ,announce req/res
const torrentParser = require('./torrent-parser'); // torrent handling

const torrentFileName = process.argv[2]+".torrent"; // torrent name as argument

if (!torrentFileName) {
    console.error('Please provide a torrent file name as an argument.');
    process.exit(1);
}

const torrent = torrentParser.open(torrentFileName);

tracker.getPeers(torrent, peers => {
    console.log('list of peers: ', peers);
});
