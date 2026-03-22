import { prisma } from "@/lib/db";

export default async function sitemap() {
  const baseUrl = "https://www.smartevent.in"; // Replace with your live domain

  // 1. Fetch all cities and stacks from your database
  const cities = await prisma.city.findMany({ select: { slug: true } });
  const stacks = await prisma.techStack.findMany({ select: { slug: true } });

  // 2. Map the static main pages
  const staticPages = [
    "",
    "/jobs",
    "/register",
    "/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  }));

  // 3. Generate the "Matrix" URLs (e.g., /jobs/pune/react)
  const matrixPages = [];
  
  cities.forEach((city) => {
    stacks.forEach((stack) => {
      matrixPages.push({
        url: `${baseUrl}/jobs/${city.slug}/${stack.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  return [...staticPages, ...matrixPages];
}