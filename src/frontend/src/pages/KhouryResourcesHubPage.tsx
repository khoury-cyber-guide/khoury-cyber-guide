import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { KHOURY_RESOURCE_CATEGORIES } from '@/data/khouryResources'

export function KhouryResourcesHubPage() {
  useDocumentTitle('Khoury Resources')

  return (
    <PageWrapper>
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-alabaster sm:text-4xl">
          Khoury Resources
        </h1>
        <p className="mt-3 max-w-2xl text-base text-dim-grey">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KHOURY_RESOURCE_CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/resources/${cat.slug}`}
            className="flex flex-col gap-2 rounded-md border border-white/10 bg-graphite p-5 transition-colors hover:border-carmine/40"
          >
            <div className="border-l-4 border-carmine pl-3">
              <p className="font-semibold text-alabaster">{cat.label}</p>
            </div>
            <p className="text-sm leading-relaxed text-dim-grey">{cat.tagline}</p>
            <p className="mt-auto pt-1 text-xs font-medium text-carmine">View resources →</p>
          </Link>
        ))}
      </div>
    </PageWrapper>
  )
}
