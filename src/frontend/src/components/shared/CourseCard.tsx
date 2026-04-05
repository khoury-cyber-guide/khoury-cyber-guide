import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import type { CourseSummary } from '@/types/course'

interface CourseCardProps {
  course: CourseSummary
  compact?: boolean
}

export function CourseCard({ course, compact = false }: CourseCardProps) {
  const code = `${course.course_program} ${course.course_code}`

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex items-start gap-4 rounded-md border border-white/10 bg-graphite p-4 transition-all hover:border-carmine/60"
    >
      <Badge
        variant="outline"
        className="shrink-0 bg-carmine font-mono text-xs text-white"
      >
        {code}
      </Badge>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-alabaster transition-colors group-hover:text-carmine">
            {course.title}
          </p>
          {course.is_featured && (
            <span className="rounded border border-copper/60 bg-copper/10 px-1.5 py-0.5 text-xs font-semibold text-copper">
              ★ Our Pick
            </span>
          )}
        </div>
        {!compact && course.description && (
          <p className="mt-1 line-clamp-2 text-sm text-dim-grey">{course.description}</p>
        )}
      </div>
    </Link>
  )
}
