import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    // 1. Find the job to get the original URL
    const job = await prisma.job.findUnique({
      where: { id },
      select: { url: true }
    });

    if (!job) return NextResponse.redirect(new URL('/jobs', request.url));

    // 2. Log the click in the background (Don't await to keep it fast)
    prisma.jobClick.create({
      data: { jobId: id }
    }).catch(err => console.error("Click log failed:", err));

    // 3. Send them to the destination
    return NextResponse.redirect(job.url);
  } catch (error) {
    return NextResponse.redirect(new URL('/jobs', request.url));
  }
}