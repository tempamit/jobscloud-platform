'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Auto-select role based on URL parameter (e.g., ?role=employer)
  const initialRole = searchParams.get('role') === 'employer' ? 'EMPLOYER' : 'SEEKER';

  const [role, setRole] = useState(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create the account via our new API
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // 2. Automatically log them in after successful registration
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        throw new Error("Account created, but auto-login failed. Please sign in.");
      }

      // 3. Redirect based on role
      if (role === 'EMPLOYER') {
        router.push('/dashboard/employer'); // We will build this next!
      } else {
        router.push('/dashboard/seeker');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        
        {/* Logo & Header */}
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1D9E75]"></span>
            JobsCloud
          </a>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join thousands of tech professionals across India.
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setRole('SEEKER')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              role === 'SEEKER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            I'm looking for a job
          </button>
          <button
            type="button"
            onClick={() => setRole('EMPLOYER')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              role === 'EMPLOYER' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            I'm hiring
          </button>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              {role === 'EMPLOYER' ? 'Company Name' : 'Full Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]"
              placeholder={role === 'EMPLOYER' ? 'e.g. Interactive Pixels' : 'e.g. Amit Loomba'}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-colors focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#1D9E75] px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0F6E56] disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-[#1D9E75] hover:underline">
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}

// Wrap in Suspense to safely use useSearchParams in Next.js App Router
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}