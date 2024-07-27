'use strict'; //enforces stricter parsing and error handling

const torrentParser = require('./src/torrent-parser'); // torrent handling
const download = require('./src/download');

let torrentFileName = process.argv[2]; // torrent name as argument

if (!torrentFileName) {
    console.error('Please provide a torrent file path as an argument.');
    process.exit(1);
}


let torrent;
try {
    torrent = torrentParser.open(torrentFileName);
} catch (error) {
    console.error('Error opening torrent file:', error);
    process.exit(1);
}

download.main(torrent, torrent.info.name);
