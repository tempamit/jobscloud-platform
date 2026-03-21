import 'dotenv/config'; 
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import pg from 'pg';
const { Pool } = pg;

// The Fix: Destructure PrismaPg directly from the named exports
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Cities
  const cities = [
    { slug: 'bangalore', name: 'Bangalore', country: 'India' },
    { slug: 'pune', name: 'Pune', country: 'India' },
    { slug: 'hyderabad', name: 'Hyderabad', country: 'India' },
    { slug: 'mumbai', name: 'Mumbai', country: 'India' },
    { slug: 'gurgaon', name: 'Gurgaon', country: 'India' },
    { slug: 'chennai', name: 'Chennai', country: 'India' },
    { slug: 'noida', name: 'Noida', country: 'India' },
    { slug: 'remote', name: 'Remote', country: 'Worldwide' },
  ];

  console.log('Inserting Cities...');
  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    });
  }

  // 2. Seed Tech Stacks
  const techStacks = [
    { slug: 'python', name: 'Python', category: 'Backend' },
    { slug: 'react', name: 'React JS', category: 'Frontend' },
    { slug: 'node', name: 'Node.js', category: 'Backend' },
    { slug: 'java', name: 'Java', category: 'Backend' },
    { slug: 'golang', name: 'Golang', category: 'Backend' },
    { slug: 'devops', name: 'DevOps', category: 'Infrastructure' },
    { slug: 'data-science', name: 'Data Science', category: 'Data' },
    { slug: 'php', name: 'PHP', category: 'Backend' },
    { slug: 'angular', name: 'Angular', category: 'Frontend' },
    { slug: 'aws', name: 'AWS', category: 'Cloud' },
  ];

  console.log('Inserting Tech Stacks...');
  for (const stack of techStacks) {
    await prisma.techStack.upsert({
      where: { slug: stack.slug },
      update: {},
      create: stack,
    });
  }

  console.log('✅ Seeding complete! You now have a matrix of 80 potential SEO pages.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });