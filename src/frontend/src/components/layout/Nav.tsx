import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

const TOPICS_LINKS = [
  { label: 'Build & Secure', to: '/topics/build_and_secure' },
  { label: 'Attack & Defend', to: '/topics/attack_and_defend' },
  { label: 'Strategy & Governance', to: '/topics/strategy_and_governance' },
]

const COURSES_LINKS = [
  { label: 'CS Requirements', to: '/courses/group/CS Requirement' },
  { label: 'CY Requirements', to: '/courses/group/CY Requirement' },
  { label: 'CY Electives', to: '/courses/group/CY Elective' },
  { label: 'Supporting Courses', to: '/courses/group/Support' },
]

const KHOURY_PLACEHOLDERS = [
  'Lorem ipsum dolor',
  'Sit amet consectetur',
  'Adipiscing elit sed',
  'Do eiusmod tempor',
]

const triggerCls =
  'bg-transparent px-3 py-1.5 text-xs font-semibold tracking-widest text-alabaster hover:bg-transparent hover:text-carmine focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-carmine'

const itemCls =
  'block rounded px-3 py-2 text-sm text-alabaster transition-colors hover:bg-graphite hover:text-carmine'

const footerLinkCls =
  'block rounded px-3 py-2 text-xs text-dim-grey transition-colors hover:bg-graphite hover:text-alabaster'

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-carmine transition-opacity hover:opacity-80"
          aria-label="Khoury Cyber Guide home"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 shrink-0" aria-hidden="true">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93 4.93 19.07" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
          <span className="hidden text-sm font-semibold tracking-widest text-alabaster sm:block">
            KHOURY CYBER
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          <NavLink
            to="/start"
            className={({ isActive }) =>
              `px-3 py-1.5 text-xs font-semibold tracking-widest transition-colors ${
                isActive ? 'text-carmine' : 'text-alabaster hover:text-carmine'
              }`
            }
          >
            START HERE
          </NavLink>

          <NavigationMenu>
            <NavigationMenuList>
              {/* Topics */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerCls}>TOPICS</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-52 p-1">
                    {TOPICS_LINKS.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to} className={itemCls}>{link.label}</Link>
                      </li>
                    ))}
                    <li className="my-1 border-t border-white/10" />
                    <li>
                      <Link to="/topics" className={footerLinkCls}>All Topics →</Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Courses */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerCls}>COURSES</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-52 p-1">
                    {COURSES_LINKS.map((link) => (
                      <li key={link.to}>
                        <Link to={link.to} className={itemCls}>{link.label}</Link>
                      </li>
                    ))}
                    <li className="my-1 border-t border-white/10" />
                    <li>
                      <Link to="/courses" className={footerLinkCls}>All Courses →</Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Khoury — placeholders */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={triggerCls}>KHOURY</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-52 p-1">
                    {KHOURY_PLACEHOLDERS.map((label) => (
                      <li key={label}>
                        <span className="block cursor-not-allowed rounded px-3 py-2 text-sm text-dim-grey/60 select-none">
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded text-alabaster transition-colors hover:text-carmine md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className="border-t border-white/10 bg-black px-4 pb-6 pt-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-1">
            <MobileSection
              label="START HERE"
              links={[{ label: 'Start Here', to: '/start' }]}
              onNavigate={() => setMenuOpen(false)}
            />
            <MobileSection
              label="TOPICS"
              links={[...TOPICS_LINKS, { label: 'All Topics →', to: '/topics' }]}
              onNavigate={() => setMenuOpen(false)}
            />
            <MobileSection
              label="COURSES"
              links={[...COURSES_LINKS, { label: 'All Courses →', to: '/courses' }]}
              onNavigate={() => setMenuOpen(false)}
            />
            <div className="mt-2 border-t border-white/10 pt-4">
              <p className="mb-2 px-2 text-xs font-semibold tracking-widest text-dim-grey">KHOURY</p>
              {KHOURY_PLACEHOLDERS.map((label) => (
                <span
                  key={label}
                  className="block rounded px-2 py-2.5 text-sm text-dim-grey/60 select-none"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

interface MobileSectionProps {
  label: string
  links: { label: string; to: string }[]
  onNavigate: () => void
}

function MobileSection({ label, links, onNavigate }: MobileSectionProps) {
  return (
    <div className="border-t border-white/10 pt-3 first:border-0 first:pt-0">
      <p className="mb-1 px-2 text-xs font-semibold tracking-widest text-dim-grey">{label}</p>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block rounded px-2 py-2.5 text-sm transition-colors ${
              isActive ? 'text-carmine' : 'text-alabaster hover:text-carmine'
            }`
          }
          onClick={onNavigate}
        >
          {link.label}
        </NavLink>
      ))}
    </div>
  )
}
