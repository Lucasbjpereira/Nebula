import path from 'path';
import fs from 'fs';
import unzipper from 'unzipper';
import { exec } from 'child_process';

export function extractFiles(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err.message}`);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(directory, file);
            if (path.extname(file).toLowerCase() === '.zip') {
                extractZip(filePath);
            } else if (path.extname(file).toLowerCase() === '.rar') {
                extractRar(filePath);
            }
        });
    });
}

function extractZip(filePath) {
    const outputDir = path.dirname(filePath);
    fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: outputDir }))
        .on('close', () => {
            console.log(`Extracted ${filePath}`);
            deleteFile(filePath, 'ZIP');
        })
        .on('error', (err) => {
            console.error(`Error extracting ZIP: ${err.message}`);
        });
}

function extractRar(filePath) {
    const outputDir = path.dirname(filePath);
    const winrarPath = '"C:\\Program Files\\WinRAR\\WinRAR.exe"';
    const command = `${winrarPath} x -y "${filePath}" "${outputDir}"`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error extracting RAR: ${err.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error extracting RAR: ${stderr}`);
            return;
        }
        console.log(`Extracted ${filePath}`);
        deleteFile(filePath, 'RAR');
    });
}

function deleteFile(filePath, fileType) {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting ${fileType} file: ${err.message}`);
        } else {
            console.log(`Deleted ${fileType} file: ${filePath}`);
        }
    });
}
