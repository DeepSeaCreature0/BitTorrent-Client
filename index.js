'use strict';

const tracker = require('./tracker');
const torrentParser = require('./torrent-parser');

const torrentFileName = process.argv[2]+".torrent";

if (!torrentFileName) {
    console.error('Please provide a torrent file name as an argument.');
    process.exit(1);
}

const torrent = torrentParser.open(torrentFileName);

tracker.getPeers(torrent, peers => {
    console.log('list of peers: ', peers);
});
