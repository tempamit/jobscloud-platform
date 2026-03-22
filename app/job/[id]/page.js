import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function JobDetails({ params }) {
  // ✅ FIX: In Next.js 15+, params must be awaited
  const { id } = await params;

  if (!id) notFound();

  const job = await prisma.job.findUnique({
    where: { id },
    include: { 
      city: true, 
      techStack: true, 
      employer: true 
    }
  });

  if (!job) notFound();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navigation / Breadcrumbs */}
      <nav className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
        <Link href="/jobs" className="hover:text-[#1D9E75]">All Jobs</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-400">
          {job.title} at {job.company}
        </span>
      </nav>

      <main className="mx-auto max-w-5xl px-4 lg:flex lg:gap-8 text-left">
        {/* Main Content Card */}
        <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">{job.title}</h1>
              <p className="mt-2 text-xl font-medium text-[#1D9E75]">{job.company}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
             <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                📍 {job.city?.name || 'Remote'}
             </span>
             <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#1D9E75]">
                💻 {job.techStack?.name}
             </span>
          </div>

          <div className="mt-10 border-t border-slate-100 pt-8">
            <h2 className="text-lg font-bold text-slate-900">Job Description</h2>
            <div className="mt-4 whitespace-pre-wrap text-slate-600 leading-relaxed">
              {job.description}
            </div>
          </div>
        </div>

        {/* Sidebar Action Card */}
        <aside className="mt-8 lg:mt-0 lg:w-80">
          <div className="sticky top-8 rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold">Interested?</h3>
            <p className="mt-2 text-sm text-slate-400">Apply via the official portal below.</p>
            
            <a 
              href={job.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-8 block w-full rounded-xl bg-[#1D9E75] py-4 text-center font-bold text-white transition-all hover:bg-[#0F6E56] hover:scale-[1.02]"
            >
              Apply Now
            </a>
            
            <div className="mt-6 text-[10px] text-slate-500 uppercase tracking-widest text-center">
              Verified by JobsCloud
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}