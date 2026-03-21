import './globals.css';

export const metadata = {
  title: 'JobsCloud — Top Tech Jobs',
  description: 'Find the best remote and local tech jobs on jobs.ipds.cloud.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#1D9E75] selection:text-white" suppressHydrationWarning>
        
        {/* Master Navigation Bar - Now Full Width & Mobile Responsive */}
        <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 transition-opacity hover:opacity-80">
            <span className="h-2 w-2 rounded-full bg-[#1D9E75]"></span>
            JobsCloud
          </a>
          
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Hidden on mobile, visible on medium screens and up */}
            <div className="hidden items-center gap-1 md:flex">
              <a href="/jobs/remote/react" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">Browse jobs</a>
              <a href="/jobs/bangalore/python" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">Cities</a>
              <a href="#" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">Salaries</a>
            </div>
            
            {/* Visible on all screens, shrinks slightly on mobile */}
            <a href="/register?role=employer" className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 transition-colors hover:bg-slate-50 sm:px-4 sm:py-2 sm:text-sm">
              Post a job <span className="hidden sm:inline">— free</span>
            </a>
          </div>
        </nav>
        
        {/* Main Content Wrapper - No more width restrictions here! */}
        <main className="w-full">
          {children}
        </main>
        
      </body>
    </html>
  );
}