import type { ResourceItem } from '@/types/topic'

interface ResourceSectionProps {
  title: string
  items: ResourceItem[]
  emptyMessage?: string
}

export function ResourceSection({ title, items, emptyMessage = 'Nothing here yet.' }: ResourceSectionProps) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-dim-grey">
        {title}
      </h4>
      {items.length > 0 ? (
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <div key={item.url} className="flex items-start gap-2 rounded px-3 py-2 transition-colors hover:bg-graphite">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-carmine" aria-hidden="true" />
              <div className="min-w-0">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-alabaster underline underline-offset-2 hover:text-carmine"
                >
                  {item.name}
                </a>
                {item.description && (
                  <p className="mt-0.5 text-xs text-dim-grey">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-dim-grey">{emptyMessage}</p>
      )}
    </div>
  )
}
