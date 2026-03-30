import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { KHOURY_RESOURCE_CATEGORIES } from '@/data/khouryResources'

export function KhouryResourcesHubPage() {
  useDocumentTitle('Khoury Resources')

  return (
    <PageWrapper>
      <div className="py-12 sm:py-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-carmine">
          Khoury Resources
        </p>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">
          Lorem ipsum dolor sit amet consectetur adipiscing.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-dim-grey">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="border-t border-white/10 pb-16 pt-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KHOURY_RESOURCE_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/resources/${cat.slug}`}
              className="flex flex-col gap-2 rounded-md border border-white/10 bg-graphite p-5 transition-colors hover:border-carmine/40"
            >
              <p className="font-semibold text-alabaster">{cat.label}</p>
              <p className="text-sm leading-relaxed text-dim-grey">{cat.tagline}</p>
              <p className="mt-auto pt-2 text-xs font-medium text-carmine">View resources →</p>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  )
}
