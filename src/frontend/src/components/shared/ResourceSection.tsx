interface ResourceLinkProps {
  label: string
  href: string
}

export function ResourceLink({ label, href }: ResourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded px-3 py-2 text-sm text-alabaster transition-colors hover:bg-graphite hover:text-carmine"
    >
      {label}
      <span className="text-dim-grey" aria-hidden="true">↗</span>
    </a>
  )
}

interface ResourceSectionProps {
  title: string
  items: Record<string, string>
  emptyMessage?: string
}

export function ResourceSection({ title, items, emptyMessage = 'Nothing here yet.' }: ResourceSectionProps) {
  const entries = Object.entries(items)

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dim-grey">
        {title}
      </h4>
      {entries.length > 0 ? (
        <div className="flex flex-col gap-0.5">
          {entries.map(([label, href]) => (
            <ResourceLink key={label} label={label} href={href} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-dim-grey">{emptyMessage}</p>
      )}
    </div>
  )
}
