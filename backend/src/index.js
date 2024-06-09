import express from 'express';
import cors from 'cors'; // Importe o pacote CORS
import { fetchGamesData } from './HomeGames/homeGames.js';

const app = express();
const port = 3000;

// Use o middleware CORS
app.use(cors());

app.get('/api/home', async (req, res) => {
    try {
        const gamesData = await fetchGamesData();
        res.json(gamesData);
    } catch (error) {
        console.error('Error fetching game data:', error);
        res.status(500).json({ error: 'Failed to fetch game data' });
    }
});

// Adicione outras rotas que executam diferentes scripts aqui
// app.get('/api/other-script', async (req, res) => {
//     try {
//         const result = await otherScriptFunction();
//         res.json(result);
//     } catch (error) {
//         console.error('Error executing other script:', error);
//         res.status(500).json({ error: 'Failed to execute script' });
//     }
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});





// import { download } from './torrentClient/torrentClient.js';

// const input = process.argv[2];
// if (!input) {
//     console.error('Please provide a magnet link, .torrent file path, or game name.');
//     process.exit(1);
// }

// download(input);


// import express from 'express';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Obter o diretório atual usando import.meta.url
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, 'public')));

// // Endpoint to get game data
// app.get('/api/games', (req, res) => {
//     const gameDataPath = path.join(__dirname, 'trandingGames', 'gameData.json');
//     fs.readFile(gameDataPath, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading game data:', err);
//             return res.status(500).json({ error: 'Failed to read game data' });
//         }

//         try {
//             const jsonData = JSON.parse(data);
//             res.json(jsonData);
//         } catch (parseError) {
//             console.error('Error parsing JSON:', parseError);
//             res.status(500).json({ error: 'Failed to parse game data' });
//         }
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
