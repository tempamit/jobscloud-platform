import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req) {
  try {
    // 1. Verify the user is authenticated and is an Employer
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "EMPLOYER") {
      return NextResponse.json({ message: "Unauthorized. Employers only." }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, url, cityName, techStackName } = body;

    if (!title || !description || !url || !cityName || !techStackName) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // 2. Format the names into URL-friendly slugs (e.g., "New Delhi" -> "new-delhi")
    const citySlug = cityName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const techSlug = techStackName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // 3. Get the Employer's specific profile
    const employer = await prisma.employerProfile.findUnique({
      where: { userId: session.user.id }
    });

    // 4. Create the Job and magically connect/create the City and TechStack
    const job = await prisma.job.create({
      data: {
        title,
        description,
        url,
        company: employer.companyName, // Auto-fill their company name
        employer: { connect: { id: employer.id } },
        city: {
          connectOrCreate: {
            where: { slug: citySlug },
            create: { name: cityName, slug: citySlug }
          }
        },
        techStack: {
          connectOrCreate: {
            where: { slug: techSlug },
            create: { name: techStackName, slug: techSlug }
          }
        }
      }
    });

    return NextResponse.json({ message: "Job posted successfully!", job }, { status: 201 });

  } catch (error) {
    console.error("Job Creation Error:", error);
    // Handle Prisma's unique constraint error if they post the exact same URL twice
    if (error.code === 'P2002') {
      return NextResponse.json({ message: "A job with this exact Apply URL already exists." }, { status: 409 });
    }
    return NextResponse.json({ message: "Failed to post job." }, { status: 500 });
  }
}