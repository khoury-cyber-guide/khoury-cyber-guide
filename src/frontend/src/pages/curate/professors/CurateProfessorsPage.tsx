import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { adminDeleteProfessor } from '@/api/admin'
import apiClient from '@/api/client'

interface ProfessorSummary {
  id: number
  full_name: string
  area_of_focus: string
  photo: string
  url: string
}

export function CurateProfessorsPage() {
  useDocumentTitle('Professors — Curate')
  const { token } = useAdminAuth()
  const { data: professors, loading, error, refetch } = useApi<ProfessorSummary[]>((signal) =>
    apiClient.get('/api/professors', { signal }).then((r) => r.data),
  )
  const [deleting, setDeleting] = useState<number | null>(null)

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await adminDeleteProfessor(token!, id)
      refetch()
    } catch {
      alert('Failed to delete professor.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-alabaster">Professors</h1>
          <p className="mt-0.5 text-sm text-dim-grey">{professors?.length ?? 0} total</p>
        </div>
        <Link
          to="/curate/professors/new"
          className="rounded bg-carmine px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          + New Professor
        </Link>
      </div>

      {error && <p role="alert" className="mb-4 text-sm text-carmine">Failed to load professors.</p>}

      {loading ? (
        <p className="text-sm text-dim-grey">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-graphite/40 text-left">
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Name</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Area of focus</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(professors ?? []).map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-graphite/20">
                  <td className="px-4 py-3 font-medium text-alabaster">{p.full_name}</td>
                  <td className="px-4 py-3 text-dim-grey">{p.area_of_focus || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/curate/professors/${p.id}/edit`}
                        className="text-xs text-dim-grey transition-colors hover:text-alabaster"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.full_name)}
                        disabled={deleting === p.id}
                        className="text-xs text-dim-grey transition-colors hover:text-carmine disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {professors?.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-dim-grey">
                    No professors yet.
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
