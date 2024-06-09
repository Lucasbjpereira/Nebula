import puppeteer from 'puppeteer';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getMagnetLink(gameName) {
    const browser = await puppeteer.launch({
        headless: false,
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
    await page.goto('https://pcgamestorrents.com/');
    await page.type('.uk-search-input', gameName);
    await page.keyboard.press('Enter');
    await page.waitForNavigation();

    let link = await page.evaluate(() => {
        return document.querySelector('.uk-first-column .uk-link-reset').href;
    });

    await page.goto(link);
    await delay(2000);

    link = await page.evaluate(() => {
        return document.querySelector('.uk-card a').href;
    });

    console.log(link);
    await page.goto(link);
    await delay(10000);

    let hashUrl = await page.evaluate(() => {
        return document.querySelector('#url').value;
    });

    await page.goto(`https://gamedownloadurl.lol/get-url.php?url=${hashUrl}`);
    await delay(2000);

    let magnet = await page.evaluate(() => {
        return document.querySelector('input').value;
    });

    console.log(magnet);
    await browser.close();
    return magnet;
}

export default getMagnetLink;
