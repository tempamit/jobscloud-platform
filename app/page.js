import { prisma } from "@/lib/db";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default async function Home() {
  // 1. Fetch the 6 newest jobs for the homepage "Live Feed"
  // We include city and techStack relations to show the labels correctly
  const featuredJobs = await prisma.job.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { 
      city: true, 
      techStack: true 
    }
  });

  // Add this query to your Home() function in app/page.js
const trendingJobs = await prisma.job.findMany({
  take: 3,
  orderBy: {
    clicks: { _count: 'desc' } // Most clicked roles
  },
  include: { city: true, techStack: true }
});

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
            Find your next tech job <br className="hidden sm:block" />
            <span className="text-[#1D9E75]">without the noise.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            The cleanest job board for developers. Browse thousands of verified 
            remote and local opportunities curated by <strong>JobsCloud</strong>.
          </p>
          
          {/* Interactive Search Bar Component */}
          <div className="mx-auto mt-12 max-w-3xl">
             <SearchBar /> 
          </div>

          <div className="mt-8 flex justify-center gap-4 text-sm font-medium text-slate-400">
             <span>Popular:</span>
             <Link href="/jobs/remote/react" className="text-[#1D9E75] hover:underline">React</Link>
             <Link href="/jobs/bangalore/python" className="text-[#1D9E75] hover:underline">Python</Link>
             <Link href="/jobs/delhi/node" className="text-[#1D9E75] hover:underline">Node.js</Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Latest Opportunities</h2>
            <p className="mt-1 text-slate-500">Freshly scraped and verified roles from across the web.</p>
          </div>
          <Link href="/jobs" className="group text-sm font-bold text-[#1D9E75]">
            View all jobs <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <Link 
                key={job.id} 
                href={`/job/${job.id}`} 
                className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-[#1D9E75] hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1D9E75]">
                      {job.techStack?.name || 'Tech'}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-[#1D9E75] transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-base font-medium text-slate-500">{job.company}</p>
                </div>
                
                <div className="mt-8 flex items-center justify-between border-t border-slate-50 pt-6">
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <span className="text-lg">📍</span> {job.city?.name || 'Remote'}
                  </div>
                  <span className="text-sm font-bold text-[#1D9E75] opacity-0 transition-opacity group-hover:opacity-100">
                    Apply Now
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-500">No jobs found yet. Run the scraper to populate the database!</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-900 py-16 mt-20">
        <div className="mx-auto max-w-7xl px-4 text-center text-white sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Built for the modern developer.</h2>
          <p className="mt-4 text-slate-400">No trackers. No irrelevant ads. Just high-quality tech roles.</p>
        </div>
      </section>
    </div>
  );
}