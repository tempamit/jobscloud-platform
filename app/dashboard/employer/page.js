import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/db";
import Link from "next/link";

export default async function EmployerDashboard() {
  // 1. Secure the page: Get the active session
  const session = await getServerSession(authOptions);

  // 2. Kick out unauthenticated users or standard Seekers
  if (!session || session.user.role !== "EMPLOYER") {
    redirect("/login"); // We will build this next!
  }

 // 3. Fetch the specific Employer's data from the database
 const employer = await prisma.employerProfile.findUnique({
  where: { userId: session.user.id },
  include: { 
    jobs: {
      orderBy: { createdAt: 'desc' }, // Show newest jobs first
      include: {
        city: true,
        techStack: true
      }
    } 
  }
});

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dashboard Navigation */}
      <nav className="bg-white border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1D9E75]"></span>
            JobsCloud <span className="text-sm font-medium text-slate-500 ml-2 border-l pl-2">Employer</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">
              {employer?.companyName}
            </span>
            <div className="h-8 w-8 rounded-full bg-[#1D9E75] text-white flex items-center justify-center font-bold text-sm">
              {employer?.companyName?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Manage your job postings and candidates.</p>
          </div>
          <Link 
  href="/dashboard/employer/post-job" 
  className="rounded-xl bg-[#1D9E75] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F6E56]"
>
  + Post a New Job
</Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Active Jobs</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{employer?.jobs.length || 0}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Views</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Applicants</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">0</p>
          </div>
        </div>

        {/* Jobs List Area */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Your Job Postings</h2>
          </div>
          
          {employer?.jobs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-slate-500 mb-4">You haven't posted any jobs yet.</p>
              <Link href="/dashboard/employer/post-job" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                Create your first job post
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {employer.jobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between px-6 py-5 transition-colors hover:bg-slate-50">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{job.title}</h3>
                    <div className="mt-1.5 flex items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {job.city?.name || 'Remote'}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {job.techStack?.name || 'General'}
                      </span>
                      <span>•</span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-medium text-[#1D9E75] hover:text-[#0F6E56] hover:underline"
                    >
                      View Live Link ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}