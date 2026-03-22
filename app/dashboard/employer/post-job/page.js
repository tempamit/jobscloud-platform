'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    cityName: '',
    techStackName: '',
    url: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // Success! Route them back to their dashboard
      router.push('/dashboard/employer');
      router.refresh();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        
        <button 
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Post a New Job</h1>
          <p className="text-sm text-slate-500 mb-8">Fill out the details below to publish your opening to the JobsCloud network.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800 border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Job Title</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Senior Frontend Engineer" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">City</label>
                <input type="text" name="cityName" required value={formData.cityName} onChange={handleChange} placeholder="e.g. Pune" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Primary Tech Stack</label>
                <input type="text" name="techStackName" required value={formData.techStackName} onChange={handleChange} placeholder="e.g. React" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Application URL</label>
              <input type="url" name="url" required value={formData.url} onChange={handleChange} placeholder="https://your-company.com/apply" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]" />
              <p className="mt-1.5 text-xs text-slate-500">Where should candidates go to apply?</p>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Job Description</label>
              <textarea name="description" required rows={6} value={formData.description} onChange={handleChange} placeholder="Describe the role, responsibilities, and requirements..." className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75] resize-y" />
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#1D9E75] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F6E56] disabled:opacity-70">
                {loading ? 'Publishing Job...' : 'Publish Job Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}