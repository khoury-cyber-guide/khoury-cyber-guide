import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { getTopicBySlug } from '@/api/topics'
import { adminCreateTopic, adminUpdateTopic } from '@/api/admin'
import { KVPairInput } from '@/components/shared/KVPairInput'
import { ToolItemInput, type ToolEntry } from '@/components/shared/ToolItemInput'
import apiClient from '@/api/client'
import type { TopicCategory } from '@/types/topic'

type ResourceEntry = { name: string; url: string; description: string }
interface CourseSummary { id: number; course_program: string; course_code: number; title: string }

const CATEGORIES: { value: TopicCategory; label: string }[] = [
  { value: 'build_and_secure', label: 'Build & Secure' },
  { value: 'attack_and_defend', label: 'Attack & Defend' },
  { value: 'strategy_and_governance', label: 'Strategy & Governance' },
]

function toEntries(items: { name: string; url: string; description?: string }[] = []): ResourceEntry[] {
  return items.map(({ name, url, description }) => ({ name, url, description: description ?? '' }))
}

function fromEntries(entries: ResourceEntry[]) {
  return entries.filter((e) => e.name && e.url)
}

function toToolEntries(items: { name: string; download_url?: string; support_url?: string; description?: string }[] = []): ToolEntry[] {
  return items.map(({ name, download_url, support_url, description }) => ({
    name, download_url: download_url ?? '', support_url: support_url ?? '', description: description ?? '',
  }))
}

function fromToolEntries(entries: ToolEntry[]) {
  return entries.filter((e) => e.name).map(({ name, download_url, support_url, description }) => ({
    name,
    ...(download_url && { download_url }),
    ...(support_url && { support_url }),
    ...(description && { description }),
  }))
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 128)
}

function SearchableCheckList<T extends { id: number }>({
  label,
  items,
  selected,
  onChange,
  renderLabel,
}: {
  label: string
  items: T[]
  selected: number[]
  onChange: (ids: number[]) => void
  renderLabel: (item: T) => string
}) {
  const [query, setQuery] = useState('')
  const filtered = items.filter((item) =>
    renderLabel(item).toLowerCase().includes(query.toLowerCase()),
  )
  const toggle = (id: number) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-dim-grey">{label}</span>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter…"
        className="w-full rounded border border-white/15 bg-graphite px-2.5 py-2 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none"
      />
      <div className="max-h-48 overflow-y-auto rounded border border-white/10 bg-graphite/40">
        {filtered.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-dim-grey">No results.</p>
        ) : (
          filtered.map((item) => (
            <label
              key={item.id}
              className={`flex cursor-pointer items-center gap-2.5 border-b border-white/5 px-3 py-2 text-sm transition-colors last:border-0 ${
                selected.includes(item.id)
                  ? 'bg-carmine/10 text-carmine'
                  : 'text-alabaster hover:bg-graphite/60'
              }`}
            >
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-carmine"
                checked={selected.includes(item.id)}
                onChange={() => toggle(item.id)}
              />
              {renderLabel(item)}
            </label>
          ))
        )}
      </div>
      {selected.length > 0 && (
        <p className="text-xs text-dim-grey">{selected.length} selected</p>
      )}
    </div>
  )
}

const inputCls =
  'w-full rounded border border-white/15 bg-graphite px-3 py-2.5 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none'

const labelCls = 'text-xs font-semibold text-dim-grey'

export function CurateTopicFormPage() {
  const { slug } = useParams<{ slug?: string }>()
  const isEdit = !!slug
  useDocumentTitle(isEdit ? 'Edit Topic — Curate' : 'New Topic — Curate')

  const { token } = useAdminAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [topicSlug, setTopicSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [category, setCategory] = useState<TopicCategory>('build_and_secure')
  const [order, setOrder] = useState(0)
  const [description, setDescription] = useState('')

  const [courseIds, setCourseIds] = useState<number[]>([])
  const [khouryResourceIds, setKhouryResourceIds] = useState<number[]>([])
  const [availableCourses, setAvailableCourses] = useState<CourseSummary[]>([])
  const [availableKhouryResources, setAvailableKhouryResources] = useState<{ id: number; name: string }[]>([])

  const [certifications, setCertifications] = useState<ResourceEntry[]>([])
  const [learningTools, setLearningTools] = useState<ResourceEntry[]>([])
  const [blogsNewsletters, setBlogsNewsletters] = useState<ResourceEntry[]>([])
  const [tools, setTools] = useState<ToolEntry[]>([])
  const [offCampusOtherResources, setOffCampusOtherResources] = useState<ResourceEntry[]>([])

  const [whatIs, setWhatIs] = useState('')
  const [commonAttacksTitle, setCommonAttacksTitle] = useState('')
  const [commonAttacks, setCommonAttacks] = useState('')
  const [whyCare, setWhyCare] = useState('')
  const [stillConfused, setStillConfused] = useState<ResourceEntry[]>([])
  const [activeResearch, setActiveResearch] = useState<ResourceEntry[]>([])
  const [otherResources, setOtherResources] = useState<ResourceEntry[]>([])

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const c1 = new AbortController()
    const c2 = new AbortController()
    apiClient.get('/api/courses', { signal: c1.signal }).then((r) => setAvailableCourses(r.data)).catch(() => {})
    apiClient.get('/api/khoury-resources', { signal: c2.signal, params: { category: 'clubs_on_campus_events' } }).then((r) => setAvailableKhouryResources(r.data)).catch(() => {})
    return () => { c1.abort(); c2.abort() }
  }, [])

  useEffect(() => {
    if (!isEdit || !slug) return
    const controller = new AbortController()
    getTopicBySlug(controller.signal, slug)
      .then((t) => {
        setTitle(t.title)
        setTopicSlug(t.slug)
        setSlugManual(true)
        setCategory(t.category)
        setOrder(t.order)
        setDescription(t.description)

        setCourseIds(t.courses.map((c) => c.id))
        setKhouryResourceIds(t.khoury_resources.map((r: { id: number }) => r.id))

        setCertifications(toEntries(t.off_campus?.certifications))
        setLearningTools(toEntries(t.off_campus?.learning_tools))
        setBlogsNewsletters(toEntries(t.off_campus?.blogs_newsletters))
        setTools(toToolEntries(t.off_campus?.tools))
        setOffCampusOtherResources(toEntries(t.off_campus?.other_resources))

        const m = t.misc ?? {}
        setWhatIs(m.what_is ?? '')
        setCommonAttacksTitle(m.common_attacks_title ?? '')
        setCommonAttacks(m.common_attacks ?? '')
        setWhyCare(m.why_care ?? '')
        setStillConfused(toEntries(m.still_confused))
        setActiveResearch(toEntries(m.active_research))
        setOtherResources(toEntries(m.other_resources))
      })
      .catch(() => setError('Failed to load topic.'))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [isEdit, slug])

  const handleTitleChange = (v: string) => {
    setTitle(v)
    if (!slugManual) setTopicSlug(slugify(v))
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      title,
      category,
      slug: topicSlug,
      order,
      description,
      course_ids: courseIds,
      khoury_resource_ids: khouryResourceIds,
      off_campus: {
        certifications: fromEntries(certifications),
        learning_tools: fromEntries(learningTools),
        blogs_newsletters: fromEntries(blogsNewsletters),
        tools: fromToolEntries(tools),
        other_resources: fromEntries(offCampusOtherResources),
      },
      misc: {
        ...(whatIs && { what_is: whatIs }),
        ...(commonAttacksTitle && { common_attacks_title: commonAttacksTitle }),
        ...(commonAttacks && { common_attacks: commonAttacks }),
        ...(whyCare && { why_care: whyCare }),
        ...(stillConfused.length && { still_confused: fromEntries(stillConfused) }),
        ...(activeResearch.length && { active_research: fromEntries(activeResearch) }),
        ...(otherResources.length && { other_resources: fromEntries(otherResources) }),
      },
    }

    try {
      if (isEdit) {
        await adminUpdateTopic(token!, slug!, payload)
      } else {
        await adminCreateTopic(token!, payload)
      }
      navigate('/curate/topics')
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
        <h1 className="text-2xl font-bold text-alabaster">{isEdit ? 'Edit Topic' : 'New Topic'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
        {/* Basic Info */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Basic Info</h2>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className={labelCls}>Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="slug" className={labelCls}>Slug</label>
            <input
              id="slug"
              type="text"
              value={topicSlug}
              onChange={(e) => { setTopicSlug(e.target.value); setSlugManual(true) }}
              pattern="^[a-z0-9-]{1,128}$"
              title="Lowercase letters, numbers, and hyphens only"
              className={inputCls}
              required
            />
            <p className="text-xs text-dim-grey/70">Auto-generated from title. Lowercase, hyphens only.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="category" className={labelCls}>Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TopicCategory)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="order" className={labelCls}>Display order</label>
              <input
                id="order"
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className={labelCls}>Short description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={inputCls}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Content</h2>

          {[
            { id: 'what_is', label: 'What is it? (extended)', value: whatIs, set: setWhatIs },
            { id: 'why_care', label: 'Why care?', value: whyCare, set: setWhyCare },
          ].map((f) => (
            <div key={f.id} className="flex flex-col gap-1.5">
              <label htmlFor={f.id} className={labelCls}>{f.label}</label>
              <textarea
                id={f.id}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                rows={4}
                className={inputCls}
              />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="common_attacks_title" className={labelCls}>Common attacks — section title</label>
            <input
              id="common_attacks_title"
              type="text"
              value={commonAttacksTitle}
              onChange={(e) => setCommonAttacksTitle(e.target.value)}
              placeholder="Common Attacks"
              className={inputCls}
            />
            <textarea
              id="common_attacks"
              value={commonAttacks}
              onChange={(e) => setCommonAttacks(e.target.value)}
              rows={4}
              className={inputCls}
            />
          </div>

          <KVPairInput label="Still confused? (links)" items={stillConfused} onChange={setStillConfused} />
          <KVPairInput label="Active research" items={activeResearch} onChange={setActiveResearch} />
          <KVPairInput label="Other resources" items={otherResources} onChange={setOtherResources} />
        </div>

        {/* On-Campus Links */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">On-Campus Resources</h2>

          <SearchableCheckList
            label="Related courses"
            items={availableCourses}
            selected={courseIds}
            onChange={setCourseIds}
            renderLabel={(c) => `${c.course_program} ${c.course_code} — ${c.title}`}
          />

          <SearchableCheckList
            label="Relevant clubs"
            items={availableKhouryResources}
            selected={khouryResourceIds}
            onChange={setKhouryResourceIds}
            renderLabel={(r) => r.name}
          />
        </div>

        {/* Off-Campus Links */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Off-Campus Resources</h2>
          <KVPairInput label="Certifications" items={certifications} onChange={setCertifications} />
          <KVPairInput label="Online learning tools" items={learningTools} onChange={setLearningTools} />
          <KVPairInput label="Blogs / newsletters / discords" items={blogsNewsletters} onChange={setBlogsNewsletters} />
        </div>

        {/* Common Tools & Software */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Common Tools &amp; Software</h2>
          <ToolItemInput label="Tools" items={tools} onChange={setTools} />
        </div>

        {/* Other Resources */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Other Resources</h2>
          <KVPairInput label="Resources" items={offCampusOtherResources} onChange={setOffCampusOtherResources} />
        </div>

        {error && (
          <p role="alert" className="text-sm text-carmine">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-carmine px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create topic'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/curate/topics')}
            className="rounded px-5 py-2.5 text-sm text-dim-grey transition-colors hover:text-alabaster"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
