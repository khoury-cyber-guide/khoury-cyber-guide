import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { getCourseById } from '@/api/courses'
import { adminCreateCourse, adminUpdateCourse } from '@/api/admin'
import apiClient from '@/api/client'
import type { CourseCategoryTag } from '@/types/course'

interface CourseSummary { id: number; course_program: string; course_code: number; title: string }
interface ProfessorSummary { id: number; full_name: string }

const PROGRAMS = ['CY', 'CS', 'DS', 'EECE', 'MATH', 'ENGW']
const CLASS_TYPES = ['ONLINE', 'IN-PERSON', 'BOTH']

const CATEGORY_TAGS: CourseCategoryTag[] = [
  'CY Requirement',
  'CS Requirement',
  'CY Elective',
  'Support',
]

const ATTRIBUTES = [
  'Ethical Reasoning',
  'Writing Intensive',
  'Formal/Quant Reasoning',
  'Natural/Designed World',
  'Analyzing/Using Data',
  'Creative Expression/Innovation',
  'Interpreting Culture',
  'Capstone Experience',
  'Societies/Institutions',
]

const inputCls =
  'w-full rounded border border-white/15 bg-graphite px-3 py-2.5 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none'
const labelCls = 'text-xs font-semibold text-dim-grey'

function CheckList({
  options,
  selected,
  onChange,
}: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt])
  return (
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
  )
}

function SearchableCheckList<T extends { id: number }>({
  label,
  items,
  selected,
  onChange,
  renderItem,
  filterItem,
}: {
  label: string
  items: T[]
  selected: number[]
  onChange: (ids: number[]) => void
  renderItem: (item: T) => string
  filterItem: (item: T, query: string) => boolean
}) {
  const [query, setQuery] = useState('')
  const filtered = items.filter((c) => filterItem(c, query))
  const toggle = (id: number) =>
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])

  return (
    <div className="flex flex-col gap-2">
      <span className={labelCls}>{label}</span>
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
          filtered.map((c) => (
            <label
              key={c.id}
              className={`flex cursor-pointer items-center gap-2.5 border-b border-white/5 px-3 py-2 text-sm transition-colors last:border-0 ${
                selected.includes(c.id)
                  ? 'bg-carmine/10 text-carmine'
                  : 'text-alabaster hover:bg-graphite/60'
              }`}
            >
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-carmine"
                checked={selected.includes(c.id)}
                onChange={() => toggle(c.id)}
              />
              {renderItem(c)}
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

export function CurateCourseFormPage() {
  const { id } = useParams<{ id?: string }>()
  const isEdit = !!id
  useDocumentTitle(isEdit ? 'Edit Course — Curate' : 'New Course — Curate')

  const { token } = useAdminAuth()
  const navigate = useNavigate()

  const [program, setProgram] = useState('CY')
  const [code, setCode] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [extendedDescription, setExtendedDescription] = useState('')
  const [url, setUrl] = useState('')
  const [coreq, setCoreq] = useState(false)
  const [terms, setTerms] = useState('')
  const [tutoring, setTutoring] = useState('')
  const [categoryTags, setCategoryTags] = useState<string[]>([])
  const [attributes, setAttributes] = useState<string[]>([])
  const [prereqIds, setPrereqIds] = useState<number[]>([])
  const [professorIds, setProfessorIds] = useState<number[]>([])
  const [prereqText, setPrereqText] = useState('')
  const [classType, setClassType] = useState('')
  const [avgSectionSummer, setAvgSectionSummer] = useState('')
  const [avgSectionFallSpring, setAvgSectionFallSpring] = useState('')
  const [avgSizeSummer, setAvgSizeSummer] = useState('')
  const [avgSizeFallSpring, setAvgSizeFallSpring] = useState('')
  const [notes, setNotes] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [availableCourses, setAvailableCourses] = useState<CourseSummary[]>([])
  const [availableProfessors, setAvailableProfessors] = useState<ProfessorSummary[]>([])

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    apiClient.get('/api/courses', { signal: controller.signal })
      .then((r) => setAvailableCourses(r.data))
      .catch(() => {})
    apiClient.get('/api/professors', { signal: controller.signal })
      .then((r) => setAvailableProfessors(r.data))
      .catch(() => {})
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!isEdit || !id) return
    const controller = new AbortController()
    getCourseById(controller.signal, Number(id))
      .then((c) => {
        setProgram(c.course_program)
        setCode(String(c.course_code))
        setTitle(c.title)
        setDescription(c.description)
        setExtendedDescription(c.extended_description)
        setUrl(c.url)
        setCoreq(c.coreq)
        setTerms(c.terms.join(', '))
        setTutoring(c.tutoring)
        setCategoryTags(c.category_tag)
        setAttributes(c.attributes)
        setPrereqIds(c.prereqs.map((p) => p.id))
        setProfessorIds(c.past_professors.map((p) => p.id))
        setPrereqText(c.prereq_text ?? '')
        setClassType(c.class_type ?? '')
        setAvgSectionSummer(String(c.avg_section_count?.summer ?? ''))
        setAvgSectionFallSpring(String(c.avg_section_count?.fall_spring ?? ''))
        setAvgSizeSummer(String(c.avg_class_size?.summer ?? ''))
        setAvgSizeFallSpring(String(c.avg_class_size?.fall_spring ?? ''))
        setNotes(c.notes ?? '')
        setIsFeatured(c.is_featured ?? false)
      })
      .catch(() => setError('Failed to load course.'))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [isEdit, id])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      course_program: program,
      course_code: Number(code),
      title,
      description,
      extended_description: extendedDescription,
      url,
      coreq,
      prereq_text: prereqText,
      terms: terms.split(',').map((t) => t.trim()).filter(Boolean),
      tutoring,
      category_tag: categoryTags as CourseCategoryTag[],
      attributes,
      class_type: classType || null,
      avg_section_count: {
        summer: avgSectionSummer !== '' ? Number(avgSectionSummer) : undefined,
        fall_spring: avgSectionFallSpring !== '' ? Number(avgSectionFallSpring) : undefined,
      },
      avg_class_size: {
        summer: avgSizeSummer !== '' ? Number(avgSizeSummer) : undefined,
        fall_spring: avgSizeFallSpring !== '' ? Number(avgSizeFallSpring) : undefined,
      },
      notes,
      is_featured: isFeatured,
      prereq_ids: prereqIds,
      professor_ids: professorIds,
    }

    try {
      if (isEdit) {
        await adminUpdateCourse(token!, Number(id), payload)
      } else {
        await adminCreateCourse(token!, payload)
      }
      navigate('/curate/courses')
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
        <h1 className="text-2xl font-bold text-alabaster">{isEdit ? 'Edit Course' : 'New Course'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
        {/* Basic Info */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Basic Info</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="program" className={labelCls}>Program</label>
              <select
                id="program"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className={inputCls}
              >
                {PROGRAMS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label htmlFor="code" className={labelCls}>Course code</label>
              <input
                id="code"
                type="number"
                min={0}
                max={9999}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="4740"
                className={inputCls}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className={labelCls}>Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputCls}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="terms" className={labelCls}>Past terms (comma-separated)</label>
            <input
              id="terms"
              type="text"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="e.g. Fall 2024, Spring 2025, Fall 2025"
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="classType" className={labelCls}>Class type</label>
            <select
              id="classType"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              className={`${inputCls} ${classType === '' ? 'text-dim-grey/50' : ''}`}
            >
              <option value="">— select —</option>
              {CLASS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={coreq}
              onChange={(e) => setCoreq(e.target.checked)}
              className="h-4 w-4 accent-carmine"
            />
            <span className={labelCls}>Co-requisite (not just prerequisite)</span>
          </label>
        </div>

        {/* Descriptions */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Descriptions</h2>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className={labelCls}>Catalogue description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="extended" className={labelCls}>Expanded description</label>
            <textarea
              id="extended"
              value={extendedDescription}
              onChange={(e) => setExtendedDescription(e.target.value)}
              rows={5}
              className={inputCls}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="tutoring" className={labelCls}>Tutoring info</label>
            <input
              id="tutoring"
              type="text"
              value={tutoring}
              onChange={(e) => setTutoring(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Tags & Attributes */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Tags &amp; Attributes</h2>

          <div className="flex flex-col gap-1.5">
            <span className={labelCls}>Internal category</span>
            <CheckList options={CATEGORY_TAGS} selected={categoryTags} onChange={setCategoryTags} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={labelCls}>NUPath attributes</span>
            <CheckList options={ATTRIBUTES} selected={attributes} onChange={setAttributes} />
          </div>
        </div>

        {/* Prerequisites */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Prerequisites</h2>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="prereqText" className={labelCls}>Catalog prereq text</label>
            <textarea
              id="prereqText"
              value={prereqText}
              onChange={(e) => setPrereqText(e.target.value)}
              rows={3}
              placeholder={"e.g.\nCS 3650 with a minimum grade of D-\nCS 5600 with a minimum grade of D-"}
              className={inputCls}
            />
          </div>
          <SearchableCheckList
            label="Link prerequisite courses"
            items={availableCourses.filter((c) => c.id !== Number(id))}
            selected={prereqIds}
            onChange={setPrereqIds}
            renderItem={(c) => `${c.course_program} ${c.course_code} — ${c.title}`}
            filterItem={(c, q) => `${c.course_program} ${c.course_code} ${c.title}`.toLowerCase().includes(q.toLowerCase())}
          />
        </div>

        {/* Past Professors */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Past Professors</h2>
          <SearchableCheckList
            label="Select professors"
            items={availableProfessors}
            selected={professorIds}
            onChange={setProfessorIds}
            renderItem={(p) => p.full_name}
            filterItem={(p, q) => p.full_name.toLowerCase().includes(q.toLowerCase())}
          />
        </div>

        {/* Enrollment Stats */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Enrollment Stats</h2>
          <div className="flex flex-col gap-1.5">
            <span className={labelCls}>Avg. section count</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-dim-grey/70">Summer</span>
                <input type="number" min={0} value={avgSectionSummer} onChange={(e) => setAvgSectionSummer(e.target.value)} placeholder="0" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-dim-grey/70">Fall / Spring</span>
                <input type="number" min={0} value={avgSectionFallSpring} onChange={(e) => setAvgSectionFallSpring(e.target.value)} placeholder="0" className={inputCls} />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className={labelCls}>Avg. class size</span>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-dim-grey/70">Summer</span>
                <input type="number" min={0} value={avgSizeSummer} onChange={(e) => setAvgSizeSummer(e.target.value)} placeholder="0" className={inputCls} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-dim-grey/70">Fall / Spring</span>
                <input type="number" min={0} value={avgSizeFallSpring} onChange={(e) => setAvgSizeFallSpring(e.target.value)} placeholder="0" className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-4 rounded-lg border border-white/10 p-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-dim-grey">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Internal notes (not shown publicly)"
            className={inputCls}
          />
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 accent-carmine"
            />
            <span className="text-xs font-semibold text-dim-grey">Featured on Start Here</span>
          </label>
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
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create course'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/curate/courses')}
            className="rounded px-5 py-2.5 text-sm text-dim-grey transition-colors hover:text-alabaster"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
