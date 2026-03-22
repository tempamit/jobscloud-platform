import { prisma } from "@/lib/db";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default async function Home() {
  // 1. Fetch the 6 newest jobs for the homepage "Live Feed"
  const featuredJobs = await prisma.job.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { city: true, techStack: true }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero & Search Section */}
      <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Find your next tech job <br className="hidden sm:block" />
          <span className="text-[#1D9E75]">without the noise.</span>
        </h1>
        
        <div className="mx-auto mt-10 max-w-3xl">
           <SearchBar /> 
        </div>

        {/* Featured Jobs Grid */}
        <div className="mt-24 text-left">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Latest Opportunities</h2>
            <Link href="/jobs" className="text-sm font-semibold text-[#1D9E75] hover:underline">
              View all jobs →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <Link 
                key={job.id} 
                // ✅ CORRECTION: Point to the singular /job/[id] route
                href={`/job/${job.id}`} 
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-[#1D9E75] hover:shadow-md"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">
                      {job.techStack?.name || 'Tech'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1D9E75] transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">{job.company}</p>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs text-slate-400 font-medium">
                       {job.city?.name || 'Remote'}
                    </span>
                    <span className="text-xs font-bold text-[#1D9E75]">Apply →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}