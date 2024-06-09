import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const steamGridApiKey = '4aedae5af01f4e84ee78b6dfa9d34b63';

// Definindo __dirname para ES Módulos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const jsonFilePath = path.join(__dirname, 'gameData.json');

export const fetchGamesData = async () => {
    // Verificar se o arquivo JSON já existe
    if (fs.existsSync(jsonFilePath)) {
        // Ler e retornar o conteúdo do arquivo JSON existente
        const data = fs.readFileSync(jsonFilePath, 'utf8');
        return JSON.parse(data);
    }

    const url = 'https://steamdb.info/';

    const browser = await puppeteer.launch({
        headless: "new", // Usar o novo modo headless
        args: [
            '--disable-popup-blocking',
            '--disable-features=IsolateOrigins,site-per-process'
        ],
        defaultViewport: {
            width: 1280,
            height: 800
        }
    });

    const page = await browser.newPage();
    await page.goto(url);

    const categories = await page.evaluate(() => {
        const extractGames = (section) => {
            const rows = section.querySelectorAll('.table-products.table-hover tbody tr.app');
            const games = [];
            rows.forEach(row => {
                const titleElement = row.querySelector('td:nth-child(2) a.css-truncate');
                const title = titleElement ? titleElement.innerText : null;
                if (title) {
                    games.push(title);
                }
            });
            return games;
        };

        const sections = document.querySelectorAll('.container-products .row .span6');
        const mostPlayedSection = sections[0];
        const trendingSection = sections[1];
        const popularReleasesSection = sections[2];
        const hotReleasesSection = sections[3];

        return {
            mostPlayedGames: extractGames(mostPlayedSection),
            trendingGames: extractGames(trendingSection),
            popularReleases: extractGames(popularReleasesSection),
            hotReleases: extractGames(hotReleasesSection)
        };
    });

    const fetchImages = async (game) => {
        const searchUrl = `https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(game)}`;
        const searchOptions = {
            headers: {
                'Authorization': `Bearer ${steamGridApiKey}`
            }
        };

        try {
            const response = await fetch(searchUrl, searchOptions);
            const searchData = await response.json();

            if (searchData.success && searchData.data.length > 0) {
                const images = await Promise.all(searchData.data.map(async item => {
                    const imageUrl = `https://www.steamgriddb.com/api/v2/grids/game/${item.id}?dimensions=920x430`;
                    const imageOptions = {
                        headers: {
                            'Authorization': `Bearer ${steamGridApiKey}`
                        }
                    };
                    const imageResponse = await fetch(imageUrl, imageOptions);
                    const imageData = await imageResponse.json();
                    if (imageData.success && imageData.data.length > 0) {
                        return imageData.data[0].url;
                    }
                    return null;
                }));

                const validImages = images.filter(url => url !== null);

                if (validImages.length > 0) {
                    const heroUrl = await fetchHero(searchData.data[0].id);

                    return {
                        title: game,
                        images: validImages,
                        hero: heroUrl
                    };
                }
            }
        } catch (error) {
            console.error(`Failed to fetch images for game: ${game}`, error);
        }

        return null;
    };

    const fetchHero = async (gameId) => {
        const heroUrl = `https://www.steamgriddb.com/api/v2/heroes/game/${gameId}`;
        const heroOptions = {
            headers: {
                'Authorization': `Bearer ${steamGridApiKey}`
            }
        };

        try {
            const response = await fetch(heroUrl, heroOptions);
            const heroData = await response.json();

            if (heroData.success && heroData.data.length > 0) {
                return heroData.data[0].url;
            }
        } catch (error) {
            console.error(`Failed to fetch hero image for gameId: ${gameId}`, error);
        }

        return null;
    };

    const fetchGamesWithImages = async (games) => {
        return (await Promise.all(games.map(game => fetchImages(game))))
            .filter(game => game !== null);
    };

    const jsonResult = {
        mostPlayedGames: await fetchGamesWithImages(categories.mostPlayedGames),
        trendingGames: await fetchGamesWithImages(categories.trendingGames),
        popularReleases: await fetchGamesWithImages(categories.popularReleases),
        hotReleases: await fetchGamesWithImages(categories.hotReleases)
    };

    // Salvar o resultado em um arquivo JSON
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonResult, null, 2), 'utf8');

    await browser.close();

    return jsonResult;
};
