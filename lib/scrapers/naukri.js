const { startScraper } = require('./scraper_base'); // Our stealth config
const { prisma } = require('../db');
// 1. Define the helper at the top (outside the main function)
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function scrapeNaukri(searchQuery = "software-engineer", city = "delhi") {
  const { page, browser } = await startScraper(`https://www.naukri.com/${searchQuery}-jobs-in-${city}`);

  try {
    // 1. Wait for the job cards to load (Naukri uses 'srp-jobtuple-wrapper')
    console.log("Waiting for human-like delay...");
    await delay(Math.floor(Math.random() * 3000) + 2000);
    await page.waitForSelector('.srp-jobtuple-wrapper', { timeout: 15000 });

    // 2. Extract Data from the Page
    const jobs = await page.evaluate((sourceName) => {
      const jobCards = Array.from(document.querySelectorAll('.srp-jobtuple-wrapper'));
        
      
      return jobCards.map(card => {
        const titleEl = card.querySelector('a.title');
        const companyEl = card.querySelector('a.comp-name');
        const descEl = card.querySelector('.job-desc');
        const urlEl = card.querySelector('a.title');
        
        return {
          title: titleEl?.innerText || "Unknown Title",
          company: companyEl?.innerText || "Private Company",
          description: descEl?.innerText || "Click to view full description on Naukri.",
          url: urlEl?.href || "",
          source: sourceName
        };
      });
    }, "Naukri");
    

    // 3. Upsert into Database (Prevents Duplicates)
    for (const job of jobs) {
      if (job.url) {
        await prisma.job.upsert({
          where: { url: job.url },
          update: {}, // Don't change if exists
          create: {
            title: job.title,
            company: job.company,
            description: job.description,
            url: job.url,
            source: job.source,
            // Assuming you have IDs for Delhi/React logic
            cityId: "clxe...", 
            techStackId: "clxe..."
          }
        });
      }
    }

    console.log(`✅ Successfully synced ${jobs.length} jobs from Naukri.`);
  } catch (err) {
    console.error("❌ Naukri Scrape Failed:", err.message);
  } finally {
    await browser.close();
  }
}