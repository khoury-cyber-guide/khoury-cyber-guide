import { Link } from 'react-router-dom';

const LOREM_SHORT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim.';
const LOREM_LONG = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

const categories = [
  {
    slug: 'build-and-secure',
    label: 'Build & Secure',
    description: LOREM_SHORT,
    topics: [
      { code: 'A1', label: 'Network Security' },
      { code: 'A2', label: 'Cloud Security' },
      { code: 'A3', label: 'Application Security' },
      { code: 'A4', label: 'System & OS Security' },
      { code: 'A5', label: 'Cryptography' },
      { code: 'A6', label: 'Security Engineering' },
      { code: 'A7', label: 'AI & ML Security' },
      { code: 'A8', label: 'IoT & Physical Security' },
    ],
  },
  {
    slug: 'attack-and-defend',
    label: 'Attack & Defend',
    description: LOREM_SHORT,
    topics: [
      { code: 'B9',  label: 'Penetration Testing' },
      { code: 'B10', label: 'Social Engineering' },
      { code: 'B11', label: 'Security Operations' },
      { code: 'B12', label: 'Incident Response' },
      { code: 'B13', label: 'Threat Intelligence' },
    ],
  },
  {
    slug: 'strategy-and-governance',
    label: 'Strategy & Governance',
    description: LOREM_SHORT,
    topics: [
      { code: 'C14', label: 'Risk Assessment' },
      { code: 'C15', label: 'GRC & Data Privacy' },
      { code: 'C16', label: 'Ethics of Cybersecurity' },
    ],
  },
];

const learningPaths = [
  { slug: 'edge-case',    label: 'Edge Case Path',            description: LOREM_SHORT },
  { slug: 'career',       label: 'Career-Focused Path',       description: LOREM_SHORT },
  { slug: 'foundational', label: 'Foundational Path',         description: LOREM_SHORT },
  { slug: 'defensive',    label: 'Defensive / Blue Team Path', description: LOREM_SHORT },
  { slug: 'offensive',    label: 'Offensive / Red Team Path', description: LOREM_SHORT },
  { slug: 'policy-risk',  label: 'Policy & Risk Path',        description: LOREM_SHORT },
];

export default function TopicsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* Page Description */}
      <div className="bg-white border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-black uppercase tracking-wider text-neu-black mb-3">
          Topic Resource Pages
        </h1>
        <p className="text-gray-600 leading-relaxed">{LOREM_LONG}</p>
      </div>

      {/* 3-Column Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-400 shadow-sm">
        {categories.map((cat, i) => (
          <div
            key={cat.slug}
            className={`flex flex-col ${i < 2 ? 'md:border-r border-gray-400' : ''}`}
          >
            {/* Column Header */}
            <Link
              to={`/topics/${cat.slug}`}
              className="block bg-neu-gray text-white text-center font-black uppercase tracking-widest text-sm py-4 px-4 hover:bg-neu-red transition-colors"
            >
              {cat.label}
            </Link>

            {/* Description */}
            <div className="bg-[#4d4d4d] px-5 py-4 border-t border-gray-500">
              <p className="text-gray-300 text-sm leading-relaxed">{cat.description}</p>
            </div>

            {/* Topic List */}
            <div className="bg-[#585858] px-5 py-4 border-t border-gray-500 flex-1">
              <ul className="space-y-2">
                {cat.topics.map((topic) => (
                  <li key={topic.code} className="flex items-baseline gap-2">
                    <span className="text-neu-red font-bold text-xs shrink-0">{topic.code}</span>
                    <Link
                      to={`/topics/${cat.slug}/${topic.code.toLowerCase()}`}
                      className="text-gray-200 text-sm hover:text-white hover:underline transition-colors"
                    >
                      {topic.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Learning Path Explanation */}
      <div className="bg-white border border-gray-200 p-8 shadow-sm">
        <h2 className="text-xl font-black uppercase tracking-wider text-neu-black mb-3">
          Learning Path Explanation
        </h2>
        <p className="text-gray-600 leading-relaxed">{LOREM_LONG}</p>
      </div>

      {/* Learning Paths */}
      <div className="space-y-3">
        {learningPaths.map((path) => (
          <Link
            key={path.slug}
            to={`/paths/${path.slug}`}
            className="flex group shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-neu-red group-hover:bg-neu-red-dark transition-colors w-52 shrink-0 flex items-center justify-center px-4 py-5">
              <span className="text-white font-black uppercase text-xs tracking-wider text-center leading-snug">
                {path.label}
              </span>
            </div>
            <div className="bg-white border border-l-0 border-gray-200 flex-1 px-6 py-5 flex items-center">
              <p className="text-gray-600 text-sm leading-relaxed">{path.description}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
