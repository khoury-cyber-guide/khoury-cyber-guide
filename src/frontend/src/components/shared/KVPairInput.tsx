interface ResourceEntry {
  name: string
  url: string
  description: string
}

interface KVPairInputProps {
  label: string
  items: ResourceEntry[]
  onChange: (items: ResourceEntry[]) => void
}

export function KVPairInput({ label, items, onChange }: KVPairInputProps) {
  const update = (index: number, field: keyof ResourceEntry, val: string) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: val } : item)))
  }

  const remove = (index: number) => onChange(items.filter((_, i) => i !== index))

  const add = () => onChange([...items, { name: '', url: '', description: '' }])

  const inputCls =
    'rounded border border-white/15 bg-graphite px-2.5 py-2 text-sm text-alabaster placeholder:text-dim-grey/50 focus:border-carmine/60 focus:outline-none'

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-dim-grey">{label}</span>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-1.5 rounded border border-white/10 p-2.5">
          <div className="flex gap-2">
            <input
              type="text"
              value={item.name}
              onChange={(e) => update(i, 'name', e.target.value)}
              placeholder="Name"
              className={`w-36 shrink-0 ${inputCls}`}
            />
            <input
              type="url"
              value={item.url}
              onChange={(e) => update(i, 'url', e.target.value)}
              placeholder="URL"
              className={`min-w-0 flex-1 ${inputCls}`}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove"
              className="shrink-0 text-dim-grey transition-colors hover:text-carmine"
            >
              ✕
            </button>
          </div>
          <input
            type="text"
            value={item.description}
            onChange={(e) => update(i, 'description', e.target.value)}
            placeholder="Description (optional)"
            className={`w-full ${inputCls}`}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="self-start text-xs text-carmine hover:underline"
      >
        + Add
      </button>
    </div>
  )
}
