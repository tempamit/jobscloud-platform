'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [stack, setStack] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const citySlug = city.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const stackSlug = stack.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (citySlug && stackSlug) router.push(`/jobs/${citySlug}/${stackSlug}`);
    else router.push(`/jobs`);
  };

  return (
    <div className="rounded-2xl bg-white p-2 shadow-lg sm:p-4 border border-slate-200">
      <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Tech Stack (e.g. React)"
          value={stack}
          onChange={(e) => setStack(e.target.value)}
          className="w-full rounded-xl border-0 bg-slate-50 px-4 py-4 text-slate-900 outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-[#1D9E75]"
        />
        <input
          type="text"
          placeholder="City (e.g. Pune)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-xl border-0 bg-slate-50 px-4 py-4 text-slate-900 outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-[#1D9E75]"
        />
        <button type="submit" className="rounded-xl bg-[#1D9E75] px-8 py-4 font-bold text-white transition-colors hover:bg-[#0F6E56]">
          Search
        </button>
      </form>
    </div>
  );
}