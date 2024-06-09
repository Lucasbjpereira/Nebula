import WebTorrent from 'webtorrent';
import path from 'path';
import fs from 'fs';
import { extractFiles } from '../fileExtractor/fileExtractor.js';
import getMagnetLink from '../magnetLink/getMagnetLink.js';

const client = new WebTorrent();

export async function download(gameNameOrPath) {
    const options = { path: './downloads' };
    let magnetOrPath = gameNameOrPath;

    if (!magnetOrPath || (path.extname(magnetOrPath) !== '.torrent' && !magnetOrPath.startsWith('magnet:'))) {
        magnetOrPath = await getMagnetLink(gameNameOrPath);
    }

    addTorrent(magnetOrPath, options);
}

function addTorrent(magnetOrPath, options) {
    if (fs.existsSync(magnetOrPath) && path.extname(magnetOrPath) === '.torrent') {
        client.add(path.resolve(magnetOrPath), options, onTorrent);
    } else {
        client.add(magnetOrPath, options, onTorrent);
    }
}

function onTorrent(torrent) {
    console.log(`Downloading ${torrent.name}`);

    torrent.on('download', (bytes) => {
        console.log(`Progress: ${(torrent.progress * 100).toFixed(2)}%`);
    });

    torrent.on('done', () => {
        console.log(`Download completed: ${torrent.name}`);
        extractFiles('./downloads');
        client.destroy();
    });

    torrent.on('error', (err) => {
        console.error(`Error: ${err.message}`);
    });
}
