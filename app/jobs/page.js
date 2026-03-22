import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AllJobsPage() {
  // 1. Fetch all jobs, newest first
  const jobs = await prisma.job.findMany({
    include: {
      city: true,
      techStack: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            All Tech Opportunities
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Browse our complete database of {jobs.length} verified roles.
          </p>
        </div>
      </div>

      {/* Main List */}
      <main className="mx-auto max-w-5xl px-4 mt-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div 
                key={job.id} 
                className="group relative flex flex-col justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-[#1D9E75] hover:shadow-md md:flex-row md:items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1D9E75]">
                      {job.techStack?.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Added {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 group-hover:text-[#1D9E75] transition-colors">
                    {job.title}
                  </h2>
                  <p className="mt-1 text-lg font-medium text-slate-500">{job.company}</p>
                  
                  <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">📍 {job.city?.name}</span>
                    <span className="text-slate-300">|</span>
                    <span className="font-medium text-[#1D9E75]">Full-time</span>
                  </div>
                </div>

                <div className="flex items-center">
                  <Link 
                    href={`/job/${job.id}`} // ✅ Corrected Singular Path
                    className="w-full rounded-2xl bg-slate-900 px-8 py-4 text-center font-bold text-white transition-all hover:bg-slate-800 md:w-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 py-32 text-center">
              <p className="text-xl text-slate-500 font-medium text-center">
                Our database is currently updating. Check back in a few minutes!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}