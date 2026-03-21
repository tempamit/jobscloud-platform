import './globals.css'; // Inject Tailwind!

export const metadata = {
    title: 'JobsCloud — Top Tech Jobs',
    description: 'Find the best remote and local tech jobs on jobs.ipds.cloud.',
  };

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900" suppressHydrationWarning>
        
        {/* Modern Frosted Glass Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
            <a href="/" className="text-2xl font-extrabold tracking-tight text-blue-600">
                Jobs<span className="text-slate-900">Cloud</span>
                </a>
              <div className="hidden space-x-8 md:flex">
                <a href="/jobs/bangalore/react" className="text-sm font-medium text-slate-500 transition-colors hover:text-blue-600">Bangalore React</a>
                <a href="/jobs/remote/python" className="text-sm font-medium text-slate-500 transition-colors hover:text-blue-600">Remote Python</a>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Main Content Wrapper */}
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        
      </body>
    </html>
  );
}