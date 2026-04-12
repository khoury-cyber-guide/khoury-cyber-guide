export type DegreePlanTag =
  | 'CY'
  | 'CY/CJ'
  | 'CY/BA'
  | 'CY/ECON'
  | 'Honors'
  | 'PlusOne'
  | 'Undergraduate'
  | 'Graduate'
  | 'Combined Major'
  | 'Dual Major'

export const DEGREE_PLAN_TAG_STYLE: Record<DegreePlanTag, string> = {
  'CY':            'border-carmine/60 bg-carmine/10 text-carmine',
  'CY/CJ':         'border-carmine/60 bg-carmine/10 text-carmine',
  'CY/BA':         'border-carmine/60 bg-carmine/10 text-carmine',
  'CY/ECON':       'border-carmine/60 bg-carmine/10 text-carmine',
  'Honors':        'border-copper/60 bg-copper/10 text-copper',
  'PlusOne':       'border-copper/60 bg-copper/10 text-copper',
  'Undergraduate': 'border-white/20 bg-white/5 text-dim-grey',
  'Graduate':      'border-white/20 bg-white/5 text-dim-grey',
  'Combined Major':'border-white/20 bg-white/5 text-dim-grey',
  'Dual Major':    'border-white/20 bg-white/5 text-dim-grey',
}

export interface CourseEntry {
  code: string
  title?: string
}

export interface PlanYear {
  year: number
  fall: CourseEntry[]
  spring: CourseEntry[]
  summer1: CourseEntry[]
  summer2: CourseEntry[]
}

export interface DegreePlan {
  slug: string
  title: string
  degreeType: string
  graduationTerm: string
  tags: DegreePlanTag[]
  years: PlanYear[]
}

export const DEGREE_PLANS: DegreePlan[] = [
  {
    slug: 'cy-ex1',
    title: 'Example Plan #1',
    degreeType: 'B.S. Cybersecurity',
    graduationTerm: 'Spring 2027',
    tags: ['CY'],
    years: [
      {
        year: 1,
        fall: [
          { code: 'CS2500', title: 'Fundamentals of Computer Science 1' },
          { code: 'CS1800', title: 'Discrete Structures' },
          { code: 'ENGW1111', title: 'First-Year Writing' },
          { code: 'MATH1341', title: 'Calculus 1 for Science & Engineering' },
          { code: 'CS1200', title: 'First Year Seminar' },
        ],
        spring: [
          { code: 'CS2510', title: 'Fundamentals of Computer Science 2' },
          { code: 'CY2550', title: 'Foundations of Cybersecurity' },
          { code: 'MATH1342', title: 'Calculus 2 for Science & Engineering' },
          { code: 'COMM1210', title: 'Persuasion and Rhetoric' },
        ],
        summer1: [
          { code: 'CS3500', title: 'Object-Oriented Design' },
          { code: 'ARTS2340', title: 'Painting Basics' },
        ],
        summer2: [
          { code: 'SOCL1101', title: 'Introduction to Sociology' },
          { code: 'MATH3081', title: 'Probability & Statistics' },
        ],
      },
      {
        year: 2,
        fall: [
          { code: 'CS3000', title: 'Algorithms and Data' },
          { code: 'CS3650', title: 'Computer Systems' },
          { code: 'COMM2551', title: 'Free Speech in Cyberspace' },
          { code: 'JPNS1101', title: 'Elementary Japanese 1' },
          { code: 'CS3800', title: 'Theory of Computation' },
        ],
        spring: [
          { code: 'CS4700', title: 'Network Fundamentals' },
          { code: 'CY3740', title: 'Systems Security' },
          { code: 'CS4400', title: 'Programming Languages' },
        ],
        summer1: [
          { code: 'CS3520', title: 'Programming in C++' },
        ],
        summer2: [],
      },
      {
        year: 3,
        fall: [
          { code: 'ARAB1101', title: 'Elementary Arabic 1' },
          { code: 'ENGW3302', title: 'Advanced Writing in Technical Professions' },
          { code: 'CY5240', title: 'Cyberlaw: Privacy, Ethics, and Digital Rights' },
          { code: 'EECE2310', title: 'Introduction to Digital Design and Computer Architecture' },
        ],
        spring: [
          { code: 'CY4740', title: 'Network Security' },
          { code: 'CHNS1101', title: 'Elementary Chinese 1' },
          { code: 'CY4930', title: 'Cybersecurity Capstone' },
          { code: 'CY2990', title: 'Elective (Other Institution Transfer Credit)' },
        ],
        summer1: [],
        summer2: [{ code: 'CO-OP' }],
      },
      {
        year: 4,
        fall: [{ code: 'CO-OP' }],
        spring: [
          { code: 'CS4730', title: 'Distributed Systems' },
          { code: 'CY4770', title: 'Foundations of Cryptography' },
          { code: 'General Elective' },
          { code: 'General Elective' },
        ],
        summer1: [],
        summer2: [],
      },
    ],
  },
  {
    slug: 'cy-cj-ex1',
    title: 'Example Plan #1',
    degreeType: 'B.S. Cybersecurity & Criminal Justice',
    graduationTerm: 'Spring 2026',
    tags: ['CY', 'CY/CJ'],
    years: [
      {
        year: 1,
        fall: [
          { code: 'CS2500', title: 'Fundamentals of Computer Science 1' },
          { code: 'CS1800', title: 'Discrete Structures' },
          { code: 'CS1200', title: 'First Year Seminar' },
          { code: 'ENGW1111', title: 'First-Year Writing' },
        ],
        spring: [
          { code: 'CS2510', title: 'Fundamentals of Computer Science 2' },
          { code: 'CY2550', title: 'Foundations of Cybersecurity' },
          { code: 'CRIM1100', title: 'Introduction to Criminal Justice' },
          { code: 'CRIM1120', title: 'Criminology' },
        ],
        summer1: [
          { code: 'CS3500', title: 'Object-Oriented Design' },
          { code: 'COMM1101', title: 'Introduction to Communication Studies' },
        ],
        summer2: [],
      },
      {
        year: 2,
        fall: [
          { code: 'CS3650', title: 'Computer Systems' },
          { code: 'MATH1342', title: 'Calculus 2 for Science and Engineering' },
          { code: 'CRIM3600', title: 'Criminal Justice Research Methods' },
          { code: 'CRIM1110', title: 'Criminal Due Process' },
        ],
        spring: [
          { code: 'CY3740', title: 'System Security' },
          { code: 'CS3000', title: 'Algorithms and Data' },
          { code: 'CRIM1400', title: 'Human Trafficking' },
          { code: 'PHIL1145', title: 'Technology and Human Values' },
          { code: 'CS1210', title: 'Professional Development for Co-op' },
        ],
        summer1: [
          { code: 'THTR1125', title: 'Improvisation' },
          { code: 'ENGW3302', title: 'Advanced Writing in the Technical Professions' },
        ],
        summer2: [{ code: 'CO-OP' }],
      },
      {
        year: 3,
        fall: [
          { code: 'FINA1209', title: 'Personal Finance' },
          { code: 'CO-OP' },
        ],
        spring: [
          { code: 'CS4700', title: 'Network Fundamentals' },
          { code: 'CRIM3700', title: 'Analyzing and Using Data on Crime and Justice' },
          { code: 'CY4170', title: 'The Law, Ethics, and Policy of Data and Digital Technologies' },
          { code: 'CRIM4040', title: 'Crime Prevention' },
        ],
        summer1: [],
        summer2: [{ code: 'CO-OP' }],
      },
      {
        year: 4,
        fall: [
          { code: 'CRIM3040', title: 'Psychology of Crime' },
          { code: 'MUSC2101', title: 'Black Popular Music' },
          { code: 'CO-OP' },
        ],
        spring: [
          { code: 'CY4740', title: 'Network Security' },
          { code: 'CY4930', title: 'Cybersecurity Capstone' },
          { code: 'CRIM3050', title: 'Organized Crime' },
          { code: 'CRIM3110', title: 'Gender Crime and Justice' },
        ],
        summer1: [],
        summer2: [],
      },
    ],
  },
  {
    slug: 'cy-cj-ex2',
    title: 'Example Plan #2',
    degreeType: 'B.S. Cybersecurity & Criminal Justice',
    graduationTerm: 'Spring 2026',
    tags: ['CY', 'CY/CJ'],
    years: [
      {
        year: 1,
        fall: [
          { code: 'CRIM1100', title: 'Introduction to Criminal Justice' },
          { code: 'CRIM1110', title: 'Criminal Due Process' },
          { code: 'CS2500', title: 'Fundamentals of Computer Science 1' },
          { code: 'CS1800', title: 'Discrete Structures' },
          { code: 'CS1200', title: 'First Year Seminar' },
        ],
        spring: [
          { code: 'CRIM1120', title: 'Criminology' },
          { code: 'CY2550', title: 'Foundations of Cybersecurity' },
          { code: 'POLS1160', title: 'International Relations' },
          { code: 'CS2510', title: 'Fundamentals of Computer Science 2' },
        ],
        summer1: [],
        summer2: [],
      },
      {
        year: 2,
        fall: [
          { code: 'CRIM1400', title: 'Human Trafficking' },
          { code: 'CRIM3600', title: 'Criminal Justice Research Methods' },
          { code: 'CS3500', title: 'Object-Oriented Design' },
          { code: 'POLS3420', title: 'U.S. National Security Policy' },
        ],
        spring: [
          { code: 'CRIM3120', title: 'Race, Crime, and Justice' },
          { code: 'CS3000', title: 'Algorithms and Data' },
          { code: 'CS3650', title: 'Computer Systems' },
          { code: 'MUSC1001', title: 'Music in Everyday Life' },
          { code: 'CS1210', title: 'Professional Development for Co-op' },
        ],
        summer1: [],
        summer2: [{ code: 'CO-OP' }],
      },
      {
        year: 3,
        fall: [{ code: 'CO-OP' }],
        spring: [
          { code: 'CRIM2320', title: 'Youth Crime and Justice' },
          { code: 'CRIM2350', title: 'Policing a Democratic Society' },
          { code: 'CS4700', title: 'Network Fundamentals' },
          { code: 'CY3740', title: 'System Security' },
        ],
        summer1: [],
        summer2: [{ code: 'CO-OP' }],
      },
      {
        year: 4,
        fall: [{ code: 'CO-OP' }],
        spring: [
          { code: 'CY4170', title: 'The Law, Ethics, and Policy of Data and Digital Technologies' },
          { code: 'CY4740', title: 'Network Security' },
          { code: 'ENGW3302', title: 'Advanced Writing in the Technical Professions' },
          { code: 'INNO2301', title: 'Innovation!' },
        ],
        summer1: [],
        summer2: [],
      },
      {
        year: 5,
        fall: [
          { code: 'CRIM3040', title: 'Psychology of Crime' },
          { code: 'FINA1209', title: 'Personal Finance' },
          { code: 'KORE1101', title: 'Elementary Korean 1' },
        ],
        spring: [
          { code: 'CS4530', title: 'Fundamentals of Software Engineering' },
          { code: 'CY4930', title: 'Cybersecurity Capstone' },
          { code: 'KORE1102', title: 'Elementary Korean 2' },
          { code: 'SOCL1101', title: 'Intro to Sociology' },
        ],
        summer1: [],
        summer2: [],
      },
    ],
  },
  {
    slug: 'cy-cj-ex3',
    title: 'Example Plan #3',
    degreeType: 'B.S. Cybersecurity & Criminal Justice',
    graduationTerm: 'Spring 2026',
    tags: ['CY', 'CY/CJ'],
    years: [
      {
        year: 1,
        fall: [
          { code: 'CS1200', title: 'First Year Seminar' },
          { code: 'CS1800', title: 'Discrete Structures' },
          { code: 'CS2500', title: 'Fundamentals of Computer Science 1' },
          { code: 'CRIM1100', title: 'Intro to Criminal Justice' },
          { code: 'CRIM1120', title: 'Criminology' },
        ],
        spring: [
          { code: 'CS2510', title: 'Fundamentals of Computer Science 2' },
          { code: 'CY2550', title: 'Foundations of Cybersecurity' },
          { code: 'CRIM3600', title: 'Criminal Due Process' },
          { code: 'CRIM2350', title: 'Policing a Democratic Society' },
        ],
        summer1: [
          { code: 'COMM1112', title: 'Public Speaking' },
          { code: 'COMM1210', title: 'Persuasion and Rhetoric' },
        ],
        summer2: [],
      },
      {
        year: 2,
        fall: [
          { code: 'CS3650', title: 'Computer Systems' },
          { code: 'CRIM3600', title: 'Criminal Justice Research Methodologies' },
          { code: 'CRIM2310', title: 'Crime, Media, and Politics' },
          { code: 'CRIM2310', title: 'Courts: The Third Branch' },
        ],
        spring: [
          { code: 'CS1210', title: 'Professional Development for Co-op' },
          { code: 'CS3000', title: 'Algorithms and Data' },
          { code: 'PHIL1145', title: 'Technology and Human Values' },
          { code: 'CRIM2370', title: 'Restorative Justice' },
        ],
        summer1: [
          { code: 'CS3500', title: 'Object-Oriented Design' },
        ],
        summer2: [{ code: 'CO-OP' }],
      },
      {
        year: 3,
        fall: [{ code: 'CO-OP' }],
        spring: [
          { code: 'CS4700', title: 'Network Fundamentals' },
          { code: 'CY3740', title: 'Systems Security' },
          { code: 'CRIM3700', title: 'Analyzing and Using Data on Crime and Justice' },
          { code: 'CY4170', title: 'The Law, Ethics, and Policy of Data and Digital Technologies' },
        ],
        summer1: [
          { code: 'CRIM3040', title: 'Psychology of Crime' },
          { code: 'ENGW3302', title: 'Advanced Writing in the Technical Professions' },
        ],
        summer2: [],
      },
      {
        year: 4,
        fall: [
          { code: 'CRIM1700', title: 'Crime, Media, and Politics' },
          { code: 'CRIM5264', title: 'Immigration and Crime' },
          { code: 'CY4770', title: 'Foundations of Cryptography' },
          { code: 'PHIL4050', title: 'Artificial Intelligence and Society' },
        ],
        spring: [
          { code: 'CY4740', title: 'Network Security' },
          { code: 'CRIM3110', title: 'Gender Crime and Justice' },
          { code: 'CY4930', title: 'Cybersecurity Capstone' },
        ],
        summer1: [],
        summer2: [],
      },
    ],
  },
]
