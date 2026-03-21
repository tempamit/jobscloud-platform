export default function HomePage() {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
        
        {/* Pulsing Status Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          System Status: Online & Scraper Active
        </div>
  
        {/* Hero Section */}
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
          Welcome to <span className="text-blue-600">JobsCloud</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Your programmatic SEO architecture is live on <strong className="font-semibold text-slate-900">jobs.ipds.cloud</strong>. We are continuously hunting and categorizing the best tech jobs across the globe.
        </p>
  
        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a 
            href="/jobs/remote/react" 
            className="rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Explore Remote React
          </a>
          <a 
            href="/jobs/bangalore/python" 
            className="rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
          >
            Explore Bangalore Python
          </a>
        </div>
  
        {/* Infrastructure Stats */}
        <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-4xl font-black text-blue-600">80+</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">Auto-Generated SEO Routes</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-4xl font-black text-blue-600">Daily</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">Automated Job Scraping</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="text-4xl font-black text-blue-600">NVM2</h3>
            <p className="mt-2 text-sm font-medium text-slate-500">Hosted on Coolify VPS</p>
          </div>
        </div>
  
      </div>
    );
  }