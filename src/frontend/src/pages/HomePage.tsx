import { Link } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PageWrapper } from '@/components/layout/PageWrapper'

const EVENTS_URL = 'https://www.khoury.northeastern.edu/events/'

export function HomePage() {
  useDocumentTitle('Home')

  return (
    <PageWrapper>
      {/* Hero + Site Overview */}
      <div className="grid grid-cols-1 gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-end">
        {/* Left: hero text */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-carmine">
            Khoury College of Computer Sciences
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-alabaster sm:text-5xl">
            Your roadmap for cybersecurity at Northeastern.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-dim-grey">
            If you're on this site, you're probably part of Northeastern's Khoury College Cybersecurity
            program, or at least thinking about joining. Either way, you've likely already noticed
            something: <strong className="font-medium text-alabaster/80">this program doesn't always feel built specifically for Cybersecurity students</strong>.
          </p>
          <p className="mt-4 text-base leading-relaxed text-dim-grey">
            Because it's closely tied to Computer Science, a lot of the resources, guidance, and
            structure are fairly broad. That can make it harder to figure out <strong className="font-medium text-alabaster/80">what you should actually
            be focusing on</strong>, what tools matter, and how to start building real cybersecurity skills
            outside of class.
          </p>
          <p className="mt-4 text-base leading-relaxed text-dim-grey">
            That's exactly why this site exists. We wanted <strong className="font-medium text-alabaster/80">a single place that pulls together the
            resources we wish we had earlier</strong> — everything from learning paths and tools to career prep
            and hidden university resources. The goal is simple: make it easier to navigate the
            program, fill in the gaps, and help you get a clearer sense of how to move forward.
          </p>
        </div>

        {/* Right: site overview grid */}
        <div>
          <p className="mb-4 text-lg font-bold tracking-tight text-alabaster">
            What's on this site
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            to="/start"
            className="group flex flex-col gap-2 rounded-md border border-white/10 bg-graphite/40 p-5 transition-colors hover:border-carmine/40"
          >
            <p className="text-sm font-semibold text-alabaster group-hover:text-carmine">Start Here →</p>
            <p className="text-sm leading-relaxed text-dim-grey">
              Not sure where to begin? Start here for recommended learning paths, a curated list of high-value resources, and a short quiz to help figure out what direction makes the most sense for you.
            </p>
          </Link>
          <Link
            to="/topics"
            className="group flex flex-col gap-2 rounded-md border border-white/10 bg-graphite/40 p-5 transition-colors hover:border-carmine/40"
          >
            <p className="text-sm font-semibold text-alabaster group-hover:text-carmine">Topic Pages →</p>
            <p className="text-sm leading-relaxed text-dim-grey">
              Sixteen core areas of cybersecurity, each with on-campus and off-campus resources, commonly used tools, and practical knowledge that often isn't covered in class but is expected in real-world settings.
            </p>
          </Link>
          <Link
            to="/courses"
            className="group flex flex-col gap-2 rounded-md border border-white/10 bg-graphite/40 p-5 transition-colors hover:border-carmine/40"
          >
            <p className="text-sm font-semibold text-alabaster group-hover:text-carmine">Course Pages →</p>
            <p className="text-sm leading-relaxed text-dim-grey">
              Trying to piece together information from Banner, course descriptions, and your degree audit can be frustrating. These pages pull together the key details for the courses you're most likely to take.
            </p>
          </Link>
          <Link
            to="/resources"
            className="group flex flex-col gap-2 rounded-md border border-white/10 bg-graphite/40 p-5 transition-colors hover:border-carmine/40"
          >
            <p className="text-sm font-semibold text-alabaster group-hover:text-carmine">Khoury Pages →</p>
            <p className="text-sm leading-relaxed text-dim-grey">
              There are a lot of useful university resources out there, but they're scattered and hard to find. This section brings together the most helpful ones across seven core categories.
            </p>
          </Link>
        </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pb-16 -mt-8">
        <Link
          to="/start"
          className="inline-flex items-center gap-2 rounded-md bg-carmine px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-burgundy"
        >
          Start Here <span aria-hidden="true">→</span>
        </Link>
        <Link
          to="/topics"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-5 py-2.5 text-sm font-semibold text-alabaster transition-colors hover:border-white/30"
        >
          Browse Topics
        </Link>
      </div>

      {/* Commitment */}
      <div className="border-t border-white/10 py-8">
        <div className="border-l-4 border-carmine pl-5">
          <p className="mb-3 text-lg font-bold tracking-tight text-alabaster">Our Commitment</p>
          <p className="text-sm leading-relaxed text-dim-grey">
            This is a <strong className="font-medium text-alabaster/80">site for students, by students</strong>. Everything here comes from firsthand experience going through the program, figuring out what works, and learning what actually matters along the way. Our goal isn't to overwhelm you with resources — it's to <strong className="font-medium text-alabaster/80">point you toward the ones that are actually worth your time</strong>. We've tried to filter out the noise, highlight what's useful, and make it easier to focus on building real skills.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-dim-grey">
            At the end of the day, this program gives you a foundation, but <strong className="font-medium text-alabaster/80">what you do with it is up to you</strong>. Take advantage of every resource you can, explore different areas, and don't be afraid to go beyond what's taught in class.
          </p>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Upcoming Events */}
      <div className="border-t border-white/10 py-8">
        <p className="mb-4 text-lg font-bold tracking-tight text-alabaster">
          Upcoming Events
        </p>
        <p className="mb-4 max-w-xl text-sm leading-relaxed text-dim-grey">
          Check the Khoury events page for upcoming club events, career workshops, and industry talks.
        </p>
        <a
          href={EVENTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-white/10 px-5 py-2.5 text-sm font-semibold text-alabaster transition-colors hover:border-white/30"
        >
          View Events <span aria-hidden="true">↗</span>
        </a>
      </div>
    </PageWrapper>
  )
}
