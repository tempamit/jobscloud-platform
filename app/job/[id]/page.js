import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function JobDetails({ params }) {
  const { id } = params;

  const job = await prisma.job.findUnique({
    where: { id },
    include: { city: true, techStack: true, employer: true }
  });

  if (!job) notFound();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-500">
        <Link href="/jobs" className="hover:text-[#1D9E75]">All Jobs</Link>
        <span className="mx-2">/</span>
        <Link href={`/jobs/${job.city?.slug}/${job.techStack?.slug}`} className="hover:text-[#1D9E75]">
          {job.techStack?.name} in {job.city?.name}
        </Link>
      </nav>

      <main className="mx-auto max-w-5xl px-4 lg:flex lg:gap-8">
        {/* Main Content */}
        <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">{job.title}</h1>
              <p className="mt-2 text-lg font-medium text-[#1D9E75]">{job.company}</p>
            </div>
            <div className="hidden sm:block">
              <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600">
                {job.techStack?.name}
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-8">
            <h2 className="text-lg font-bold text-slate-900">Job Description</h2>
            <div className="mt-4 prose prose-slate max-w-none text-slate-600 leading-relaxed">
              {job.description}
            </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <aside className="mt-8 lg:mt-0 lg:w-80">
          <div className="sticky top-8 rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
            <h3 className="text-xl font-bold">Ready to apply?</h3>
            <p className="mt-2 text-sm text-slate-400">Clicking below will take you to the official application page.</p>
            
            <a 
              href={job.url} 
              target="_blank" 
              className="mt-6 block w-full rounded-xl bg-[#1D9E75] py-4 text-center font-bold transition-all hover:bg-[#0F6E56]"
            >
              Apply Now
            </a>
            
            <div className="mt-6 border-t border-slate-800 pt-6 text-xs text-slate-500">
              <p>Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
              <p className="mt-2 flex items-center gap-1">📍 {job.city?.name}</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}