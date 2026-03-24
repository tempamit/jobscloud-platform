const { startScraper } = require('./scraper_base'); 
const { prisma } = require('../db');

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function scrapeNaukriPages(searchQuery = "software-engineer", city = "delhi", maxPages = 5) {
  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    // 1. Build the dynamic URL (Naukri Page 1 is standard, Page 2+ adds -2, -3, etc.)
    const url = pageNum === 1 
      ? `https://www.naukri.com/${searchQuery}-jobs-in-${city}`
      : `https://www.naukri.com/${searchQuery}-jobs-in-${city}-${pageNum}`;

    console.log(`🚀 Scraping Page ${pageNum}: ${url}`);

    const { page, browser } = await startScraper(url);

    try {
      // 2. Randomized "Human" Delay before every page interaction
      const waitTime = Math.floor(Math.random() * 4000) + 3000; // 3-7 seconds
      await delay(waitTime);

      // 3. Wait for the job tuples to render
      await page.waitForSelector('.srp-jobtuple-wrapper', { timeout: 15000 });

      // 4. Extraction Logic (Same as before)
      const jobs = await page.evaluate((sourceName) => {
        const jobCards = Array.from(document.querySelectorAll('.srp-jobtuple-wrapper'));
        return jobCards.map(card => ({
          title: card.querySelector('a.title')?.innerText || "Unknown",
          company: card.querySelector('a.comp-name')?.innerText || "Private",
          description: card.querySelector('.job-desc')?.innerText || "",
          url: card.querySelector('a.title')?.href || "",
          source: sourceName
        }));
      }, "Naukri");

      // 5. Database Upsert
      for (const job of jobs) {
        if (!job.url) continue;
        await prisma.job.upsert({
          where: { url: job.url },
          update: {}, 
          create: {
            title: job.title,
            company: job.company,
            description: job.description,
            url: job.url,
            source: job.source,
            cityId: "clxe...", // Replace with your real DB ID
            techStackId: "clxe..." // Replace with your real DB ID
          }
        });
      }

      console.log(`✅ Page ${pageNum} complete. Synced ${jobs.length} jobs.`);

    } catch (err) {
      console.error(`❌ Error on Page ${pageNum}:`, err.message);
      // Continue to next page even if one fails
    } finally {
      await browser.close();
      // 6. Extra "Rest" delay between opening/closing browsers
      await delay(2000);
    }
  }
}