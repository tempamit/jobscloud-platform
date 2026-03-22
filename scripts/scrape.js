import 'dotenv/config';
import puppeteer from 'puppeteer';
import { prisma } from '../lib/db.js';

async function scrapeJobs() {
  console.log("🚀 Launching Smart Crawler...");
  
  // 1. Launch a headless browser
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
   // 2. Optimization: Don't load images or CSS to save time/bandwidth
   await page.setRequestInterception(true);
   page.on('request', (req) => {
     if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
       req.abort();
     } else {
       req.continue();
     }
   });

   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

   // Increase timeout to 60s and only wait for the main HTML (domcontentloaded)
   await page.goto('https://weworkremotely.com/categories/remote-front-end-programming-jobs', { 
     waitUntil: 'domcontentloaded', 
     timeout: 60000 
   });

   // 3. Wait specifically for the job container
   await page.waitForSelector('.jobs-container', { timeout: 10000 });

  // 4. Brute Force Extraction: Find any link that looks like a job
  const jobs = await page.evaluate(() => {
    const results = [];
    // Look for all links that contain "/remote-jobs/" in the URL
    const links = Array.from(document.querySelectorAll('a[href*="/remote-jobs/"]'));
    
    links.forEach((link, index) => {
      // Limit to first 15 unique jobs
      if (results.length >= 15) return;
      
      // Find the text inside or near the link that looks like a title
      const title = link.innerText.split('\n')[0].trim();
      const url = link.href;

      // Only add if we have a title and it's not a duplicate URL
      if (title && title.length > 5 && !results.find(r => r.url === url)) {
        results.push({ 
          title: title, 
          company: "Tech Company", 
          url: url 
        });
      }
    });
    return results;
  });

    console.log(`🔍 Found ${jobs.length} jobs. Updating Database...`);

    // 5. Save to your PostgreSQL database
    for (const job of jobs) {
      await prisma.job.upsert({
        where: { url: job.url },
        update: {},
        create: {
          title: job.title,
          company: job.company || "Tech Company",
          url: job.url,
          description: `Remote ${job.title} opportunity found via JobsCloud.`,
          city: {
            connectOrCreate: {
              where: { slug: 'remote' },
              create: { name: 'Remote', slug: 'remote' }
            }
          },
          techStack: {
            connectOrCreate: {
              where: { slug: 'react' },
              create: { name: 'React', slug: 'react' }
            }
          }
        }
      });
    }

    console.log("✅ Database successfully updated with fresh jobs!");
  } catch (error) {
    console.error("❌ Crawler Error:", error.message);
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

scrapeJobs();