import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "JobsCloud | Find Your Next Tech Role",
  description: "The ultimate platform for developers to find remote and local tech jobs without the noise.",
  metadataBase: new URL("https://jobs.ipds.cloud"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body 
        className={`${inter.className} min-h-screen bg-slate-50 text-slate-900`} 
        suppressHydrationWarning={true}
      >
        {/* Main Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo Section */}
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D9E75] text-white">
                  J
                </div>
                <span>Jobs<span className="text-[#1D9E75]">Cloud</span></span>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/jobs" className="text-sm font-medium text-slate-600 hover:text-[#1D9E75] transition-colors">
                  Browse Jobs
                </Link>
                <Link href="/jobs/remote/react" className="text-sm font-medium text-slate-600 hover:text-[#1D9E75] transition-colors">
                  Remote Roles
                </Link>
              </nav>
            </div>

            {/* CTA Section */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-slate-900">
                Log in
              </Link>
              <Link 
                href="/register?role=employer" 
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-95"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="relative">
          {children}
        </div>

        {/* Simple Footer */}
        <footer className="border-t border-slate-200 bg-white py-12 mt-20">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} JobsCloud by Interactive Pixels. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}