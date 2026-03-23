import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DropdownItem {
  label: string;
  to: string;
}

interface NavItem {
  label: string;
  dropdown: DropdownItem[];
}

const navItems: NavItem[] = [
  {
    label: 'START HERE',
    dropdown: [
      { label: 'What is Cybersecurity?', to: '/start-here/what-is-cybersecurity' },
      { label: 'Career Paths', to: '/start-here/career-paths' },
      { label: 'Learning Roadmap', to: '/start-here/roadmap' },
    ],
  },
  {
    label: 'TOPICS',
    dropdown: [
      { label: 'Build & Secure', to: '/topics/build-and-secure' },
      { label: 'Attack & Defend', to: '/topics/attack-and-defend' },
      { label: 'Strategy & Governance', to: '/topics/strategy-and-governance' },
    ],
  },
  {
    label: 'COURSES',
    dropdown: [
      { label: 'All Courses', to: '/courses' },
      { label: 'Undergraduate', to: '/courses/undergraduate' },
      { label: 'Graduate', to: '/courses/graduate' },
    ],
  },
  {
    label: 'KHOURY',
    dropdown: [
      { label: 'Connect', to: '/khoury/connect' },
      { label: 'Advising', to: '/khoury/advising' },
      { label: 'Co-op', to: '/khoury/coop' },
    ],
  },
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();

  const handleMouseEnter = (label: string) => setOpenMenu(label);
  const handleMouseLeave = () => setOpenMenu(null);

  const isTopicsActive = location.pathname.startsWith('/topics');

  return (
    <nav className="bg-neu-black text-white w-full z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-6 flex items-center h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mr-10 shrink-0">
          <span className="text-neu-red text-2xl font-black leading-none select-none">✦</span>
          <span className="text-white font-bold text-sm tracking-widest uppercase">
            Khoury Cyber Guide
          </span>
        </Link>

        {/* Nav Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.label === 'TOPICS' ? isTopicsActive : false;

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 px-4 h-14 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer
                    ${isActive ? 'text-neu-red' : 'text-white hover:text-neu-red'}`}
                >
                  {item.label}
                  <svg
                    className={`w-2.5 h-2.5 mt-0.5 transition-transform ${openMenu === item.label ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 10 6"
                  >
                    <path d="M0 0l5 6 5-6H0z" />
                  </svg>
                </button>

                {/* Dropdown */}
                {openMenu === item.label && (
                  <div className="absolute top-full left-0 bg-neu-black border-t-2 border-neu-red min-w-48 shadow-xl z-50">
                    {item.dropdown.map((d) => (
                      <Link
                        key={d.to}
                        to={d.to}
                        className="block px-4 py-3 text-xs font-semibold tracking-wide uppercase text-gray-300 hover:text-white hover:bg-neu-gray transition-colors border-b border-neu-gray last:border-b-0"
                        onClick={() => setOpenMenu(null)}
                      >
                        {d.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
