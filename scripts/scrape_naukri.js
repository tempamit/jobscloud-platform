import 'dotenv/config'; // ✅ This loads your DATABASE_URL from .env
import { startScraper } from '../lib/scraper_base.js';
import { prisma } from '../lib/db.js';

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function runNaukriPipeline(searchQuery = "react", citySlug = "delhi", maxPages = 3) {
  console.log(`🚀 Starting JobsCloud Pipeline: ${searchQuery} in ${citySlug}`);

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const url = pageNum === 1 
      ? `https://www.naukri.com/${searchQuery}-jobs-in-${citySlug}`
      : `https://www.naukri.com/${searchQuery}-jobs-in-${citySlug}-${pageNum}`;

    console.log(`📡 Fetching Page ${pageNum}...`);
    const { page, browser } = await startScraper(url);

    try {
      // 1. Human-like delay
      await delay(Math.floor(Math.random() * 3000) + 2000); 
      
      // 2. Wait for cards
      await page.waitForSelector('.srp-jobtuple-wrapper', { timeout: 15000 });

      // 3. Extraction
      const scrapedJobs = await page.evaluate((source) => {
        return Array.from(document.querySelectorAll('.srp-jobtuple-wrapper')).map(card => ({
          title: card.querySelector('a.title')?.innerText || "Unknown Role",
          company: card.querySelector('a.comp-name')?.innerText || "Private Company",
          description: card.querySelector('.job-desc')?.innerText || "No description provided.",
          url: card.querySelector('a.title')?.href || "",
          source: source
        }));
      }, "Naukri");

      // 4. Sync to DB
      for (const job of scrapedJobs) {
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
            city: {
              connectOrCreate: {
                where: { slug: citySlug },
                create: { name: citySlug.charAt(0).toUpperCase() + citySlug.slice(1), slug: citySlug }
              }
            },
            techStack: {
              connectOrCreate: {
                where: { slug: searchQuery },
                create: { name: searchQuery.toUpperCase(), slug: searchQuery }
              }
            }
          }
        });
      }

      console.log(`✅ Page ${pageNum}: Synced ${scrapedJobs.length} jobs.`);
    } catch (err) {
      console.error(`⚠️ Page ${pageNum} failed:`, err.message);
    } finally {
      await browser.close();
      await delay(2000); 
    }
  }
  console.log("🏁 Pipeline Complete.");
}

// Execute
runNaukriPipeline("react", "delhi", 2);