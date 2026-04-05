import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { adminDeleteKhouryResource } from '@/api/admin'
import { getKhouryResources } from '@/api/khouryResources'
import { KHOURY_RESOURCE_CATEGORY_MAP } from '@/data/khouryResources'
import type { KhouryResourceSummary } from '@/types/khouryResource'

export function CurateKhouryResourcesPage() {
  useDocumentTitle('Khoury Resources — Curate')
  const { token } = useAdminAuth()
  const { data: resources, loading, error, refetch } = useApi<KhouryResourceSummary[]>((signal) =>
    getKhouryResources(signal),
  )
  const [deleting, setDeleting] = useState<number | null>(null)
  const [query, setQuery] = useState('')

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await adminDeleteKhouryResource(token!, id)
      refetch()
    } catch {
      alert('Failed to delete resource.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-alabaster">Khoury Resources</h1>
          <p className="mt-0.5 text-sm text-dim-grey">{resources?.length ?? 0} total</p>
        </div>
        <Link
          to="/curate/khoury-resources/new"
          className="rounded bg-carmine px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          + New Resource
        </Link>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search resources…"
        className="mb-4 w-full max-w-sm rounded border border-white/15 bg-graphite px-3 py-2 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none"
      />

      {error && <p role="alert" className="mb-4 text-sm text-carmine">Failed to load resources.</p>}

      {loading ? (
        <p className="text-sm text-dim-grey">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-graphite/40 text-left">
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Name</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Category</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Priority</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(resources ?? []).filter((r) =>
                r.name.toLowerCase().includes(query.toLowerCase())
              ).map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-graphite/20">
                  <td className="px-4 py-3 font-medium text-alabaster">{r.name}</td>
                  <td className="px-4 py-3 text-xs text-dim-grey">
                    {KHOURY_RESOURCE_CATEGORY_MAP[r.category]?.label ?? r.category}
                  </td>
                  <td className="px-4 py-3 text-xs text-dim-grey">{r.priority}</td>
                  <td className="px-4 py-3 text-xs text-dim-grey">{r.is_featured ? '★' : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/curate/khoury-resources/${r.id}/edit`}
                        className="text-xs text-dim-grey transition-colors hover:text-alabaster"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id, r.name)}
                        disabled={deleting === r.id}
                        className="text-xs text-dim-grey transition-colors hover:text-carmine disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {resources?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-dim-grey">
                    No resources yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
