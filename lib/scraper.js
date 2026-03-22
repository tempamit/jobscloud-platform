const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// ✅ Apply the stealth plugin
puppeteer.use(StealthPlugin());

async function startScraper(url) {
  const browser = await puppeteer.launch({
    headless: "new", // "new" is harder to detect than true
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled', // Hides the "automated" flag
    ]
  });

  const page = await browser.newPage();

  // ✅ Rotate User-Agents to look like different devices
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
  ];
  await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);

  // ✅ Set a realistic viewport
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  
  return { page, browser };
}