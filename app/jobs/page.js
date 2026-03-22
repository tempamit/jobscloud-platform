import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic'; // Ensures this page always fetches fresh jobs

export default async function AllJobsPage() {
  // Query the database for ALL jobs, ordered by newest first
  const jobs = await prisma.job.findMany({
    include: {
      city: true,
      techStack: true,
      employer: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Latest Tech Jobs in India
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Browse {jobs.length} open roles from top companies.
          </p>
        </div>
      </div>

      {/* Jobs Feed */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No jobs posted yet</h3>
            <p className="mt-2 text-sm text-slate-500">Be the first to hire top talent on JobsCloud.</p>
            <div className="mt-6">
              <Link href="/register?role=employer" className="rounded-xl bg-[#1D9E75] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F6E56]">
                Post a Job — It's Free
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#1D9E75] hover:shadow-md sm:flex-row sm:items-center">
                
                <div>
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-[#1D9E75] transition-colors">
                    {job.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">{job.company || job.employer?.companyName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {job.city?.name}
                    </span>
                    <span>•</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {job.techStack?.name}
                    </span>
                  </div>
                  <p className="mt-4 line-clamp-2 text-sm text-slate-600">
                    {job.description}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between gap-4 sm:min-w-[140px]">
                  <span className="text-xs font-medium text-slate-400">
                    {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <a href={`/jobs/${job.id}`}
                  className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-slate-800 sm:w-auto"
                >
                  Apply Now
                </a>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}