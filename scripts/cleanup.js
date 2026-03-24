const { prisma } = require('../db');

async function archiveOldJobs() {
  console.log("🧹 Starting database maintenance...");

  // 1. Define the "Expiration Date" (30 days ago)
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - 30);

  try {
    // 2. Delete Clicks first (to satisfy Foreign Key constraints)
    const deletedClicks = await prisma.jobClick.deleteMany({
      where: {
        job: {
          createdAt: { lt: expirationDate }
        }
      }
    });

    // 3. Delete the Jobs
    const deletedJobs = await prisma.job.deleteMany({
      where: {
        createdAt: { lt: expirationDate }
      }
    });

    console.log(`✅ Maintenance Complete!`);
    console.log(`- Removed ${deletedJobs.count} expired jobs.`);
    console.log(`- Cleaned up ${deletedClicks.count} old click records.`);

  } catch (error) {
    console.error("❌ Cleanup Failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
archiveOldJobs();