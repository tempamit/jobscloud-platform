import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function SeekerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SEEKER") {
    redirect("/login");
  }

  const seeker = await prisma.seekerProfile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1D9E75]"></span>
            JobsCloud <span className="text-sm font-medium text-slate-500 ml-2 border-l pl-2">Candidate</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm">
            {seeker?.fullName?.charAt(0).toUpperCase()}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome, {seeker?.fullName}</h1>
          <p className="mt-1 text-sm text-slate-500">Track your applications and explore new opportunities.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Feed Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Applications</h2>
              <div className="text-center py-10">
                <p className="text-sm text-slate-500">You haven't applied to any jobs yet.</p>
                <Link href="/jobs" className="mt-4 inline-block text-sm font-semibold text-[#1D9E75] hover:underline">
                  Browse latest jobs →
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar / Profile Completeness */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#1D9E75]/20 bg-[#1D9E75]/5 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm">Profile Status</h3>
              <div className="mt-4 h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#1D9E75] w-1/4"></div>
              </div>
              <p className="mt-2 text-xs text-slate-600 font-medium">25% Complete</p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-2 text-xs text-slate-500 italic line-through">✓ Account Created</li>
                <li className="flex items-center gap-2 text-xs text-slate-700">○ Upload Resume</li>
                <li className="flex items-center gap-2 text-xs text-slate-700">○ Add Skills</li>
              </ul>
              <button className="mt-6 w-full rounded-xl bg-[#1D9E75] py-2.5 text-xs font-bold text-white hover:bg-[#0F6E56] transition-colors">
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}