'use strict'; //enforces stricter parsing and error handling

const torrentParser = require('./src/torrent-parser'); // torrent handling
const download = require('./src/download');

const torrentFileName = process.argv[2]+".torrent"; // torrent name as argument

if (!torrentFileName) {
    console.error('Please provide a torrent file path as an argument.');
    process.exit(1);
}

const torrent = torrentParser.open(torrentFileName);

download.main(torrent, torrent.info.name);
