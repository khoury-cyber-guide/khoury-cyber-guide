import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { adminCreateProfessor, adminUpdateProfessor } from '@/api/admin'
import apiClient from '@/api/client'

const inputCls =
  'w-full rounded border border-white/15 bg-graphite px-3 py-2.5 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none'
const labelCls = 'text-xs font-semibold text-dim-grey'

export function CurateProfessorFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  useDocumentTitle(isEdit ? 'Edit Professor — Curate' : 'New Professor — Curate')

  const { token } = useAdminAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [areaOfFocus, setAreaOfFocus] = useState('')
  const [bio, setBio] = useState('')
  const [photo, setPhoto] = useState('')
  const [url, setUrl] = useState('')

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit || !id) return
    const controller = new AbortController()
    apiClient
      .get(`/api/professors/${id}`, { signal: controller.signal })
      .then((r) => {
        const p = r.data
        setFullName(p.full_name)
        setAreaOfFocus(p.area_of_focus)
        setBio(p.bio)
        setPhoto(p.photo)
        setUrl(p.url)
      })
      .catch(() => setError('Failed to load professor.'))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [isEdit, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const payload = { full_name: fullName, area_of_focus: areaOfFocus, bio, photo, url }
    try {
      if (isEdit) {
        await adminUpdateProfessor(token!, Number(id), payload)
      } else {
        await adminCreateProfessor(token!, payload)
      }
      navigate('/curate/professors')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg ?? 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-sm text-dim-grey">Loading…</div>

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-alabaster">
          {isEdit ? 'Edit Professor' : 'New Professor'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Profile</h2>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="full_name" className={labelCls}>Full name</label>
            <input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="area_of_focus" className={labelCls}>Area of focus</label>
            <input
              id="area_of_focus"
              type="text"
              value={areaOfFocus}
              onChange={(e) => setAreaOfFocus(e.target.value)}
              placeholder="e.g. Network Security, Cryptography"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bio" className={labelCls}>Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="photo" className={labelCls}>Photo URL</label>
            <input
              id="photo"
              type="url"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="url" className={labelCls}>Profile URL</label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://khoury.northeastern.edu/people/..."
              className={inputCls}
            />
          </div>
        </div>

        {error && <p role="alert" className="text-sm text-carmine">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-carmine px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create professor'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/curate/professors')}
            className="rounded px-5 py-2.5 text-sm text-dim-grey transition-colors hover:text-alabaster"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
