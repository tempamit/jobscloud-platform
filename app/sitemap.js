import { prisma } from "@/lib/db";

export default async function sitemap() {
  // Update this line to your actual application URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const cities = await prisma.city.findMany({ select: { slug: true } });
  const stacks = await prisma.techStack.findMany({ select: { slug: true } });

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