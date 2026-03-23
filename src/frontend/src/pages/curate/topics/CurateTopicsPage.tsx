import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { getTopics } from '@/api/topics'
import { adminDeleteTopic } from '@/api/admin'
import type { TopicSummary } from '@/types/topic'

const CATEGORY_LABELS: Record<string, string> = {
  build_and_secure: 'Build & Secure',
  attack_and_defend: 'Attack & Defend',
  strategy_and_governance: 'Strategy & Governance',
}

export function CurateTopicsPage() {
  useDocumentTitle('Topics — Curate')
  const { token } = useAdminAuth()
  const { data: topics, loading, error, refetch } = useApi<TopicSummary[]>((signal) =>
    getTopics(signal),
  )
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(slug)
    try {
      await adminDeleteTopic(token!, slug)
      refetch()
    } catch {
      alert('Failed to delete topic.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-alabaster">Topics</h1>
          <p className="mt-0.5 text-sm text-dim-grey">{topics?.length ?? 0} total</p>
        </div>
        <Link
          to="/curate/topics/new"
          className="rounded bg-carmine px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          + New Topic
        </Link>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-carmine">
          Failed to load topics.
        </p>
      )}

      {loading ? (
        <p className="text-sm text-dim-grey">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-graphite/40 text-left">
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Title</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Category</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Slug</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Order</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(topics ?? []).map((topic) => (
                <tr key={topic.id} className="transition-colors hover:bg-graphite/20">
                  <td className="px-4 py-3 font-medium text-alabaster">{topic.title}</td>
                  <td className="px-4 py-3 text-dim-grey">{CATEGORY_LABELS[topic.category] ?? topic.category}</td>
                  <td className="px-4 py-3 font-mono text-xs text-dim-grey">{topic.slug}</td>
                  <td className="px-4 py-3 text-dim-grey">{topic.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/curate/topics/${topic.slug}/edit`}
                        className="text-xs text-dim-grey transition-colors hover:text-alabaster"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(topic.slug, topic.title)}
                        disabled={deleting === topic.slug}
                        className="text-xs text-dim-grey transition-colors hover:text-carmine disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {topics?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-dim-grey">
                    No topics yet.
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
