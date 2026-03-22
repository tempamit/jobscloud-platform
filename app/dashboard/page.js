import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  // Fetch jobs and count the related JobClick records
  const jobStats = await prisma.job.findMany({
    include: {
      _count: {
        select: { clicks: true } // Prisma 7 efficiency: only count, don't fetch all data
      },
      city: true,
      techStack: true
    },
    orderBy: {
      clicks: { _count: 'desc' } // Show most popular first
    }
  });

  const sourceStats = await prisma.job.groupBy({
    by: ['source'],
    _count: { _all: true }
  });

  const totalClicks = jobStats.reduce((sum, job) => sum + job._count.clicks, 0);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Platform Analytics</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time performance of JobsCloud listings.</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Applications</span>
            <span className="text-2xl font-black text-[#1D9E75]">{totalClicks}</span>
          </div>
        </header>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Job Title</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400">Company</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-center">Clicks</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobStats.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-900">{job.title}</div>
                    <div className="text-xs text-slate-500">{job.techStack?.name} • {job.city?.name}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-600 font-medium">{job.company}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-[#1D9E75]">
                      {job._count.clicks}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link 
                      href={`/job/${job.id}`} 
                      className="text-xs font-bold text-slate-400 hover:text-slate-900"
                    >
                      View Live →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}