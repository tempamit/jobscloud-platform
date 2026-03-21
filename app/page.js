'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('All cities');

  const handleSearch = (e) => {
    e.preventDefault();
    // Convert inputs to URL-friendly slugs (e.g., "Delhi NCR" -> "delhi-ncr")
    const citySlug = city === 'All cities' ? 'remote' : city.toLowerCase().replace(/\s+/g, '-');
    const stackSlug = searchQuery ? searchQuery.toLowerCase().replace(/\s+/g, '-') : 'all';
    
    // Push directly to our Programmatic SEO Matrix!
    router.push(`/jobs/${citySlug}/${stackSlug}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#1D9E75] selection:text-white">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
        <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900">
          <span className="h-2 w-2 rounded-full bg-[#1D9E75]"></span>
          JobsCloud
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">Browse jobs</button>
          <button className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">Cities</button>
          <button className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900">Salaries</button>
          <a href="/register?role=employer" className="ml-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50">
            Post a job — free
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white px-4 py-16 text-center sm:py-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#E1F5EE] px-4 py-1.5 text-xs font-semibold text-[#0F6E56]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1D9E75]"></span>
          Updated daily — 2,400+ active listings
        </div>
        
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Find tech jobs in<br />your city
        </h1>
        <p className="mx-auto mb-10 max-w-xl text-base text-slate-600 sm:text-lg">
          Local & remote roles across India's top tech hubs.<br />
          Python, React, DevOps, and more — no recruiters.
        </p>

        {/* The Search Bar */}
        <form onSubmit={handleSearch} className="mx-auto mb-6 flex w-full max-w-2xl flex-col items-center overflow-hidden rounded-2xl border border-slate-300 bg-white transition-colors focus-within:border-[#1D9E75] focus-within:ring-1 focus-within:ring-[#1D9E75] sm:flex-row">
          <input 
            type="text" 
            placeholder="Role, skill, or company..." 
            className="w-full flex-1 border-none bg-transparent px-5 py-4 text-sm outline-none placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="hidden h-8 w-[1px] bg-slate-200 sm:block"></div>
          <select 
            className="w-full border-none bg-transparent px-4 py-4 text-sm font-medium text-slate-600 outline-none sm:w-auto sm:min-w-[140px]"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option>All cities</option>
            <option>Bangalore</option>
            <option>Mumbai</option>
            <option>Hyderabad</option>
            <option>Pune</option>
            <option>Delhi NCR</option>
            <option>Chennai</option>
            <option>Remote</option>
          </select>
          <button type="submit" className="m-1.5 w-[calc(100%-12px)] whitespace-nowrap rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F6E56] sm:w-auto">
            Search jobs
          </button>
        </form>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-2">
          {['Python · Bangalore', 'React · Mumbai', 'DevOps · Remote', 'Golang · Hyderabad'].map((tag) => (
            <button key={tag} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-[#1D9E75] hover:text-[#1D9E75]">
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 border-b border-slate-200 bg-white sm:grid-cols-4">
        {[
          { num: '2,418', label: 'Active jobs' },
          { num: '340+', label: 'Companies hiring' },
          { num: '18', label: 'Cities covered' },
          { num: '42', label: 'Tech stacks' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 text-center ${i !== 3 ? 'border-r border-slate-200' : ''} ${i === 1 ? 'max-sm:border-r-0' : ''}`}>
            <div className="text-2xl font-bold text-slate-900">{stat.num}</div>
            <div className="mt-1 text-xs font-medium text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Latest Jobs Section */}
        <div className="mb-12">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-slate-900">Latest jobs</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all →</button>
          </div>

          <div className="flex flex-col gap-3">
            {/* Job Card 1 */}
            <div className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-[#1D9E75]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-500">RZ</div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-slate-900">Senior Python Developer</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                  <span>Razorpay</span><span>·</span><span>Bangalore</span>
                  <span className="rounded-full bg-[#E1F5EE] px-2.5 py-0.5 font-semibold text-[#085041]">Python</span>
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-semibold text-blue-700">Hybrid</span>
                  <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-700">New</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-bold text-slate-900">₹28–40L</div>
                <div className="mt-1 text-xs text-slate-400">2h ago</div>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-[#1D9E75]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-500">ZT</div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-slate-900">React Frontend Engineer</h3>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                  <span>Zepto</span><span>·</span><span>Mumbai</span>
                  <span className="rounded-full bg-[#E1F5EE] px-2.5 py-0.5 font-semibold text-[#085041]">React</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-semibold text-slate-700">On-site</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-bold text-slate-900">₹18–26L</div>
                <div className="mt-1 text-xs text-slate-400">5h ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Matrix Grids */}
        <div className="mb-12">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-slate-900">Browse by city</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">All cities →</button>
          </div>
          <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { name: 'Bangalore', count: '680' }, { name: 'Mumbai', count: '420' },
              { name: 'Hyderabad', count: '390' }, { name: 'Pune', count: '310' },
              { name: 'Delhi NCR', count: '280' }, { name: 'Chennai', count: '180' },
              { name: 'Remote', count: '158' }, { name: 'Kolkata', count: '74' }
            ].map((city) => (
              <div key={city.name} className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-[#1D9E75]">
                <div className="text-sm font-bold text-slate-900">{city.name}</div>
                <div className="mt-1 text-xs text-slate-500">{city.count} jobs</div>
              </div>
            ))}
          </div>

          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-slate-900">Browse by tech stack</h2>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">All stacks →</button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {[
              { name: 'Python', count: '412' }, { name: 'React', count: '388' },
              { name: 'Node.js', count: '291' }, { name: 'DevOps', count: '244' },
              { name: 'Golang', count: '187' }, { name: 'Java', count: '176' },
            ].map((stack) => (
              <div key={stack.name} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 transition-colors hover:border-[#1D9E75]">
                <span className="text-xs font-semibold text-slate-700">{stack.name}</span>
                <span className="text-[10px] text-slate-400">{stack.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom CTA */}
      <div className="border-y border-slate-200 bg-white px-4 py-16 text-center">
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Hiring a developer?</h2>
        <p className="mb-8 text-sm text-slate-600">Post your job free. Reaches 4,000+ developers across India's top tech cities.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/register?role=employer" className="rounded-xl bg-[#1D9E75] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F6E56]">
            Post a job — it's free
          </a>
          <button className="rounded-xl border border-slate-300 bg-transparent px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50">
            Why JobsCloud? →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-between gap-4 bg-white px-8 py-6 sm:flex-row">
        <div className="text-sm font-bold text-slate-400">JobsCloud</div>
        <div className="flex gap-6 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900">About</a>
          <a href="#" className="hover:text-slate-900">Sitemap</a>
          <a href="/register?role=employer" className="hover:text-slate-900">Post a job</a>
          <a href="#" className="hover:text-slate-900">Privacy</a>
        </div>
      </footer>
      
    </div>
  );
}