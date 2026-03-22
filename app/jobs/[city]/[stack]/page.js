import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function JobMatrixPage({ params }) {
  const { city, stack } = await params;

  const jobs = await prisma.job.findMany({
    where: {
      city: { slug: city },
      techStack: { slug: stack }
    },
    include: {
      city: true,
      techStack: true,
      employer: true 
    },
    orderBy: { createdAt: 'desc' } 
  });

  const cityData = await prisma.city.findUnique({ where: { slug: city } });
  const stackData = await prisma.techStack.findUnique({ where: { slug: stack } });
  
  const displayCity = cityData?.name || city.charAt(0).toUpperCase() + city.slice(1);
  const displayStack = stackData?.name || stack.charAt(0).toUpperCase() + stack.slice(1);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-medium text-[#1D9E75] hover:underline mb-4 inline-block">
            ← Back to all jobs
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {displayStack} Jobs in {displayCity}
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Showing {jobs.length} {jobs.length === 1 ? 'opportunity' : 'opportunities'} for {displayStack} developers in {displayCity}.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No {displayStack} jobs in {displayCity} right now</h3>
            <p className="mt-2 text-sm text-slate-500">Check back soon or post a job if you are hiring.</p>
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
                    <span className="font-medium text-slate-700">{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">📍 {job.city?.name}</span>
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
                    {new Date(job.createdAt).toLocaleDateString('en-IN')}
                  </span>
                  {/* ✅ FIXED: Changed to singular /job/ and used Link component */}
                  <Link 
                    href={`/job/${job.id}`}
                    className="w-full rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all hover:bg-slate-800 sm:w-auto"
                  >
                    Apply Now
                  </Link>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}