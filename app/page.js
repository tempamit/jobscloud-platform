'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [stack, setStack] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Format inputs into URL-friendly slugs (e.g., "New Delhi" -> "new-delhi")
    const citySlug = city.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const stackSlug = stack.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Route logic based on what the user typed
    if (citySlug && stackSlug) {
      router.push(`/jobs/${citySlug}/${stackSlug}`);
    } else if (citySlug) {
      // If we only have a city, we could route to a city-only page, but for now, send to all jobs
      router.push(`/jobs`); 
    } else if (stackSlug) {
      router.push(`/jobs`);
    } else {
      router.push(`/jobs`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Find your next tech job <br className="hidden sm:block" />
          <span className="text-[#1D9E75]">without the noise.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          JobsCloud connects top developers with the best startups and tech companies across India. 
        </p>

        {/* The Active Search Bar */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-2 shadow-lg sm:p-4 border border-slate-200">
          <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Job title or tech stack (e.g. React)"
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                className="w-full rounded-xl border-0 bg-slate-50 px-4 py-4 text-slate-900 outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-[#1D9E75]"
              />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="City (e.g. Pune)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border-0 bg-slate-50 px-4 py-4 text-slate-900 outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-[#1D9E75]"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#1D9E75] px-8 py-4 font-bold text-white transition-colors hover:bg-[#0F6E56]"
            >
              Search
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
          <span>Popular:</span>
          <Link href="/jobs/bangalore/node" className="rounded-full bg-slate-200 px-3 py-1 font-medium hover:bg-slate-300 transition-colors">Node in Bangalore</Link>
          <Link href="/jobs/pune/react" className="rounded-full bg-slate-200 px-3 py-1 font-medium hover:bg-slate-300 transition-colors">React in Pune</Link>
          <Link href="/jobs/remote/python" className="rounded-full bg-slate-200 px-3 py-1 font-medium hover:bg-slate-300 transition-colors">Remote Python</Link>
        </div>
      </main>
    </div>
  );
}