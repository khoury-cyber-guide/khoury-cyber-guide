import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useApi } from '@/hooks/useApi'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { getCourses } from '@/api/courses'
import { adminDeleteCourse } from '@/api/admin'
import type { CourseSummary } from '@/types/course'

export function CurateCoursesPage() {
  useDocumentTitle('Courses — Curate')
  const { token } = useAdminAuth()
  const { data: courses, loading, error, refetch } = useApi<CourseSummary[]>((signal) =>
    getCourses(signal),
  )
  const [deleting, setDeleting] = useState<number | null>(null)
  const [query, setQuery] = useState('')

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await adminDeleteCourse(token!, id)
      refetch()
    } catch {
      alert('Failed to delete course.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-alabaster">Courses</h1>
          <p className="mt-0.5 text-sm text-dim-grey">{courses?.length ?? 0} total</p>
        </div>
        <Link
          to="/curate/courses/new"
          className="rounded bg-carmine px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          + New Course
        </Link>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses…"
        className="mb-4 w-full max-w-sm rounded border border-white/15 bg-graphite px-3 py-2 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none"
      />

      {error && (
        <p role="alert" className="mb-4 text-sm text-carmine">Failed to load courses.</p>
      )}

      {loading ? (
        <p className="text-sm text-dim-grey">Loading…</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-graphite/40 text-left">
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Course</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Title</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-wider text-dim-grey">Tags</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(courses ?? []).filter((c) =>
                `${c.course_program} ${c.course_code} ${c.title}`.toLowerCase().includes(query.toLowerCase())
              ).map((course) => (
                <tr key={course.id} className="transition-colors hover:bg-graphite/20">
                  <td className="px-4 py-3 font-mono text-xs text-dim-grey">
                    {course.course_program} {course.course_code}
                  </td>
                  <td className="px-4 py-3 font-medium text-alabaster">{course.title}</td>
                  <td className="px-4 py-3 text-xs text-dim-grey">
                    {course.category_tag.join(', ')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        to={`/curate/courses/${course.id}/edit`}
                        className="text-xs text-dim-grey transition-colors hover:text-alabaster"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(course.id, course.title)}
                        disabled={deleting === course.id}
                        className="text-xs text-dim-grey transition-colors hover:text-carmine disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-dim-grey">
                    No courses yet.
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
