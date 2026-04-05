import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { adminCreateClub, adminUpdateClub } from '@/api/admin'
import apiClient from '@/api/client'

const LEVELS = ['Undergraduate', 'Graduate', 'PhD']

const TAGS = [
  'Undergraduate', 'Graduate', 'PhD',
  'Freshman', 'Sophomore', 'Junior', 'Senior',
  'Honors', 'PlusOne',
]

const inputCls =
  'w-full rounded border border-white/15 bg-graphite px-3 py-2.5 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none'
const labelCls = 'text-xs font-semibold text-dim-grey'

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt])
  return (
    <div className="flex flex-col gap-1.5">
      <span className={labelCls}>{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={`flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs transition-colors ${
              selected.includes(opt)
                ? 'border-carmine/60 bg-carmine/10 text-carmine'
                : 'border-white/15 bg-graphite text-dim-grey hover:border-white/30'
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )
}

export function CurateClubFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  useDocumentTitle(isEdit ? 'Edit Club — Curate' : 'New Club — Curate')

  const { token } = useAdminAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [level, setLevel] = useState<string[]>([])
  const [mission, setMission] = useState('')
  const [email, setEmail] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [url, setUrl] = useState('')

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit || !id) return
    const controller = new AbortController()
    apiClient
      .get(`/api/clubs/${id}`, { signal: controller.signal })
      .then((r) => {
        const c = r.data
        setName(c.name)
        setLocation(c.location)
        setLevel(c.level)
        setMission(c.mission)
        setEmail(c.email)
        setTags(c.tags)
        setUrl(c.url)
      })
      .catch((err) => { if (err?.code !== 'ERR_CANCELED') setError('Failed to load club.') })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [isEdit, id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const payload = { name, location, level, mission, email, tags, url }
    try {
      if (isEdit) {
        await adminUpdateClub(token!, Number(id), payload)
      } else {
        await adminCreateClub(token!, payload)
      }
      navigate('/curate/clubs')
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
        <h1 className="text-2xl font-bold text-alabaster">{isEdit ? 'Edit Club' : 'New Club'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Details</h2>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className={labelCls}>Club name</label>
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
            <label htmlFor="location" className={labelCls}>Location / campus</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Boston"
              className={inputCls}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="mission" className={labelCls}>Mission</label>
            <textarea
              id="mission"
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              rows={3}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className={labelCls}>Contact email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="url" className={labelCls}>Website URL</label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputCls}
            />
          </div>

          <MultiSelect label="Level" options={LEVELS} selected={level} onChange={setLevel} />
          <MultiSelect label="Tags" options={TAGS} selected={tags} onChange={setTags} />
        </div>

        {error && <p role="alert" className="text-sm text-carmine">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-carmine px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create club'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/curate/clubs')}
            className="rounded px-5 py-2.5 text-sm text-dim-grey transition-colors hover:text-alabaster"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
