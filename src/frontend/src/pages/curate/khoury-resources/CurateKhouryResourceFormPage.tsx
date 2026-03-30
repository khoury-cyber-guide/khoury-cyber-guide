import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { adminCreateKhouryResource, adminUpdateKhouryResource } from '@/api/admin'
import { getKhouryResourceById } from '@/api/khouryResources'
import { KHOURY_RESOURCE_CATEGORIES } from '@/data/khouryResources'
import type { KhouryResourceCategory } from '@/types/khouryResource'

const PRIORITIES = ['TOP_3', 'EXPAND', 'IF_SPACE']

const inputCls =
  'w-full rounded border border-white/15 bg-graphite px-3 py-2.5 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none'
const labelCls = 'text-xs font-semibold text-dim-grey'

export function CurateKhouryResourceFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  useDocumentTitle(isEdit ? 'Edit Resource — Curate' : 'New Resource — Curate')

  const { token } = useAdminAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState(KHOURY_RESOURCE_CATEGORIES[0].slug)
  const [priority, setPriority] = useState('EXPAND')
  const [isFeatured, setIsFeatured] = useState(false)

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit || !id) return
    const controller = new AbortController()
    getKhouryResourceById(Number(id), controller.signal)
      .then((r) => {
        setName(r.name)
        setDescription(r.description)
        setUrl(r.url)
        setCategory(r.category)
        setPriority(r.priority)
        setIsFeatured(r.is_featured)
      })
      .catch(() => setError('Failed to load resource.'))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [isEdit, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const payload = { name, description, url, category, priority, is_featured: isFeatured }
    try {
      if (isEdit) {
        await adminUpdateKhouryResource(token!, Number(id), payload)
      } else {
        await adminCreateKhouryResource(token!, payload)
      }
      navigate('/curate/khoury-resources')
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
          {isEdit ? 'Edit Resource' : 'New Resource'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Details</h2>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className={labelCls}>Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className={labelCls}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="url" className={labelCls}>URL</label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className={labelCls}>Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as KhouryResourceCategory)}
              className={inputCls}
            >
              {KHOURY_RESOURCE_CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="priority" className={labelCls}>Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={inputCls}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 accent-carmine"
            />
            <span className={labelCls}>Featured on Start Here</span>
          </label>
        </div>

        {error && <p role="alert" className="text-sm text-carmine">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-carmine px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create resource'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/curate/khoury-resources')}
            className="rounded px-5 py-2.5 text-sm text-dim-grey transition-colors hover:text-alabaster"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
