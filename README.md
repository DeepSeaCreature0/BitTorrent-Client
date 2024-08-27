# BitTorrent Client

A BitTorrent Client built using Node.js.

## Overview

This project is a simple BitTorrent client implemented in Node.js. It allows you to download and share files over the BitTorrent protocol.

## Features

- **Basic BitTorrent functionality**: Connects to peers, downloads and uploads files.
- **Node.js based**: Uses Node.js for a lightweight and efficient implementation.
- **Dependencies**: Utilizes `bignumber.js`, `bncode`, and `chalk` for various functionalities.

## Installation

To get started, clone this repository and install the dependencies:

```bash
git clone https://github.com/DeepSeaCreature0/BitTorrent-Client.git
cd BitTorrent-Client
npm install
```

## Usage
```bash
npm start `path to torrent file`
```

E.g: Suppose you torrent(test.torrent) file in the same folder as index.js 
```bash
npm start test.torrent
```
## Configuration
No additional configuration is required to run the client. Ensure that you have Node.js installed on your system.

## Dependencies
The project relies on the following Node.js packages:

* bignumber.js: For handling large numbers.
* bncode: For encoding and decoding Bencode data.
* chalk: For adding color to the terminal output.
These are defined in the package.json file and will be installed automatically with npm install.

## Example
![image](https://github.com/user-attachments/assets/41b1d017-8119-4ffe-bc96-e409605477d8)

