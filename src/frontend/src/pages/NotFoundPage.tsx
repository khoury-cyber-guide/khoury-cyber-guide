import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageWrapper } from '@/components/layout/PageWrapper'

export function NotFoundPage() {
  useDocumentTitle('Not Found')
  return (
    <PageWrapper className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-bold text-carmine">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-alabaster">Page not found</h1>
      <p className="mt-2 text-sm text-dim-grey">
        This page doesn't exist or may have been moved.
      </p>
      <Link
        to="/topics"
        className="mt-6 rounded-md bg-carmine px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burgundy"
      >
        Back to Topics
      </Link>
    </PageWrapper>
  )
}
