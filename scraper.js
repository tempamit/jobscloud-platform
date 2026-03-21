import 'dotenv/config';
import axios from 'axios';
import { prisma } from './lib/db.js'; // Reusing our shared DB connection!

async function runScraper() {
  console.log('🕵️‍♂️ Starting Scraper Engine...');

  try {
    // 1. Fetch the Data
    // We are using a public API for this test to guarantee data flows without bot-blocks.
    // Later, you can swap this for Cheerio HTML parsing.
    console.log('Fetching latest tech jobs...');
    const response = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev&limit=50');
    const jobs = response.data.jobs;
    console.log(`Found ${jobs.length} raw jobs. Running matching engine...`);

    // 2. Load our SEO Matrix parameters from the DB
    const cities = await prisma.city.findMany();
    const techStacks = await prisma.techStack.findMany();

    let insertedCount = 0;

    // 3. Process each job
    for (const rawJob of jobs) {
      const searchString = `${rawJob.title} ${rawJob.description}`.toLowerCase();
      const locationString = (rawJob.candidate_required_location || '').toLowerCase();

      // --- MATCHING ENGINE ---
      
      // Find which Tech Stack this job belongs to (e.g., looks for "react" or "python" in the text)
      const matchedStack = techStacks.find(stack => searchString.includes(stack.slug.toLowerCase()));
      
      // Find which City this job belongs to (defaults to 'remote' if it's a worldwide job)
      let matchedCity = cities.find(city => locationString.includes(city.slug.toLowerCase()));
      if (!matchedCity && rawJob.job_type === 'freelance' || locationString.includes('worldwide')) {
         matchedCity = cities.find(city => city.slug === 'remote');
      }

      // 4. Save to Database (If we found a match for our matrix)
      if (matchedStack && matchedCity) {
        await prisma.job.upsert({
          where: { url: rawJob.url }, // Prevents adding the same job twice
          update: {}, // If it exists, do nothing
          create: {
            title: rawJob.title,
            company: rawJob.company_name,
            description: rawJob.description.substring(0, 500) + '...', // Saving a snippet for the UI
            url: rawJob.url,
            cityId: matchedCity.id,
            techStackId: matchedStack.id,
          },
        });
        insertedCount++;
        console.log(`✅ Mapped: [${matchedCity.name} / ${matchedStack.name}] -> ${rawJob.title}`);
      }
    }

    console.log(`\n🎉 Scraping complete! Successfully injected ${insertedCount} highly-targeted jobs into the database.`);

  } catch (error) {
    console.error('❌ Scraper failed:', error.message);
  } finally {
    // Disconnect so the script exits cleanly
    await prisma.$disconnect();
  }
}

runScraper();