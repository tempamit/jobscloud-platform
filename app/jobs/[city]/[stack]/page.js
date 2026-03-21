import { prisma } from '../../../../lib/db.js';

export const revalidate = 3600;

export async function generateStaticParams() {
  const cities = await prisma.city.findMany({ select: { slug: true } });
  const stacks = await prisma.techStack.findMany({ select: { slug: true } });

  const params = [];
  for (const city of cities) {
    for (const stack of stacks) {
      params.push({ city: city.slug, stack: stack.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }) {
  const { city, stack } = await params;
  return {
    title: `${stack.toUpperCase()} Jobs in ${city.toUpperCase()} — HireLocal.tech`,
    description: `Browse the latest ${stack} developer jobs in ${city}. Updated daily.`,
  };
}

export default async function JobMatrixPage({ params }) {
  const { city, stack } = await params;

  const cityData = await prisma.city.findUnique({ where: { slug: city } });
  const stackData = await prisma.techStack.findUnique({ where: { slug: stack } });

  if (!cityData || !stackData) return <h1>404 - Matrix Not Found</h1>;

  const jobs = await prisma.job.findMany({
    where: { cityId: cityData.id, techStackId: stackData.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-3xl pt-8">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {stackData.name} Jobs in <span className="text-blue-600">{cityData.name}</span>
        </h1>
        <p className="text-lg text-slate-600">
          Explore {jobs.length} open career opportunities. Updated daily.
        </p>
      </div>
      
      {/* Job Feed */}
      <div className="flex flex-col gap-5">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900">No jobs found just yet.</h3>
            <p className="mt-2 text-slate-500">Our scraper is hunting for new roles. Check back soon.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
              
              <div className="flex flex-col justify-between sm:flex-row sm:items-start">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {job.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">🏢 {job.company || 'Confidential'}</span>
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">📍 {cityData.name}</span>
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">💻 {stackData.name}</span>
                  </div>
                </div>
                
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:mt-0"
                >
                  Apply Now →
                </a>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {job.description.replace(/<[^>]*>?/gm, '')}
                </p>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}