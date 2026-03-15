import type { TopicCategory } from '@/types/topic'

export const CATEGORY_META: Record<
  TopicCategory,
  { label: string; tagline: string; description: string }
> = {
  build_and_secure: {
    label: 'Build & Secure',
    tagline: 'Design and harden systems from the ground up.',
    description:
      'These topics cover the technologies and practices used to design, implement, and maintain secure digital systems. Rather than reacting to attacks after they occur, this category emphasizes building security directly into networks, applications, operating systems, and modern infrastructure.',
  },
  attack_and_defend: {
    label: 'Attack & Defend',
    tagline: 'Understand attacks. Learn to detect and respond.',
    description:
      'These topics explore the techniques attackers use to exploit systems as well as the tools and processes defenders rely on to identify threats, investigate incidents, and protect infrastructure. Understanding both sides is essential to security work.',
  },
  strategy_and_governance: {
    label: 'Strategy & Governance',
    tagline: 'Manage risk. Shape policy. Guide decisions.',
    description:
      'These topics cover how organizations manage cybersecurity risk, develop policies, and guide security decisions at a strategic level — including frameworks, regulatory requirements, and the ethical considerations that shape security programs.',
  },
}

export interface TopicEntry {
  title: string
  slug: string
  category: TopicCategory
  order: number
  description: string
}

export const TOPICS: TopicEntry[] = [
  // Build & Secure
  {
    title: 'Network Security',
    slug: 'network-security',
    category: 'build_and_secure',
    order: 1,
    description:
      'Protecting computer networks and the data that travels across them. Firewalls, encryption, segmentation, and traffic monitoring help prevent unauthorized access and detect malicious activity.',
  },
  {
    title: 'Cloud Security',
    slug: 'cloud-security',
    category: 'build_and_secure',
    order: 2,
    description:
      'Protecting data, applications, and infrastructure hosted on cloud platforms. Focuses on identity management, configuration, encryption, and monitoring within the shared responsibility model.',
  },
  {
    title: 'Application Security',
    slug: 'application-security',
    category: 'build_and_secure',
    order: 3,
    description:
      'Protecting software from vulnerabilities that attackers can exploit. Includes secure coding, vulnerability testing, authentication controls, and regular updates.',
  },
  {
    title: 'System & OS Security',
    slug: 'system-os-security',
    category: 'build_and_secure',
    order: 4,
    description:
      'Protecting operating systems and core software that manages hardware, processes, and user access. Permissions, system updates, and process isolation help prevent compromise.',
  },
  {
    title: 'Cryptography',
    slug: 'cryptography',
    category: 'build_and_secure',
    order: 5,
    description:
      'Using mathematical techniques to protect data and communications. Encryption, hashing, and digital signatures ensure confidentiality, integrity, and authenticity.',
  },
  {
    title: 'Security Engineering',
    slug: 'security-engineering',
    category: 'build_and_secure',
    order: 6,
    description:
      'Designing systems that are secure by design rather than adding protections later. Integrates safeguards like authentication, encryption, and access controls into system architecture.',
  },
  {
    title: 'AI & ML Security',
    slug: 'ai-ml-security',
    category: 'build_and_secure',
    order: 7,
    description:
      'Protecting machine learning systems from attacks that manipulate models or training data. Ensures AI systems behave reliably and cannot be easily exploited.',
  },
  {
    title: 'IoT & Physical Security',
    slug: 'iot-physical-security',
    category: 'build_and_secure',
    order: 8,
    description:
      'Protecting internet-connected devices and the physical systems they interact with. Focuses on preventing device compromise, unauthorized access, and hardware tampering.',
  },

  // Attack & Defend
  {
    title: 'Penetration Testing',
    slug: 'penetration-testing',
    category: 'attack_and_defend',
    order: 1,
    description:
      'Simulating real-world attacks to identify vulnerabilities before malicious actors exploit them. Uses controlled techniques to evaluate how well systems and defenses hold up.',
  },
  {
    title: 'Social Engineering',
    slug: 'social-engineering',
    category: 'attack_and_defend',
    order: 2,
    description:
      'Manipulating human behavior rather than exploiting technical vulnerabilities. Covers deception, impersonation, and psychological pressure used to extract information or gain access.',
  },
  {
    title: 'Security Operations (SOC)',
    slug: 'security-operations',
    category: 'attack_and_defend',
    order: 3,
    description:
      'Continuously monitoring systems and analyzing security events to detect potential threats. SOCs investigate suspicious activity and coordinate responses to emerging incidents.',
  },
  {
    title: 'Incident Response & Digital Forensics',
    slug: 'incident-response-forensics',
    category: 'attack_and_defend',
    order: 4,
    description:
      'Containing and recovering from attacks while forensics analyzes evidence to understand what happened. Helps organizations investigate breaches, minimize damage, and improve defenses.',
  },
  {
    title: 'Threat Intelligence',
    slug: 'threat-intelligence',
    category: 'attack_and_defend',
    order: 5,
    description:
      'Collecting and analyzing information about cyber threats and attacker behavior. Helps organizations anticipate attacks and improve detection and defensive strategies.',
  },

  // Strategy & Governance
  {
    title: 'Risk Assessment & Security Frameworks',
    slug: 'risk-assessment-frameworks',
    category: 'strategy_and_governance',
    order: 1,
    description:
      'Identifying and prioritizing cybersecurity risks based on threats, vulnerabilities, and impact. Frameworks like NIST RMF and ISO 27001 provide structured guidance through standardized controls.',
  },
  {
    title: 'GRC & Data Privacy',
    slug: 'grc-data-privacy',
    category: 'strategy_and_governance',
    order: 2,
    description:
      'Managing security policies, regulatory requirements, and organizational risk. Data privacy practices ensure sensitive information is collected, stored, and used responsibly.',
  },
  {
    title: 'Ethics of Cybersecurity',
    slug: 'ethics-of-cybersecurity',
    category: 'strategy_and_governance',
    order: 3,
    description:
      'The responsibilities and professional standards that guide how security experts use their capabilities. Covers responsible disclosure, dual-use research, and balancing security with privacy.',
  },
]

export interface LearningPath {
  label: string
  slug: string
  description: string
  topicSlugs: string[]
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    label: 'Foundational',
    slug: 'foundational',
    description: 'Topics that appear across nearly every area of the field and form the backbone of most security roles.',
    topicSlugs: ['network-security', 'cryptography', 'system-os-security', 'security-engineering', 'application-security'],
  },
  {
    label: 'Career-Focused',
    slug: 'career-focused',
    description: 'The skills most commonly requested in security job postings and internships.',
    topicSlugs: ['network-security', 'security-operations', 'cloud-security', 'incident-response-forensics', 'application-security'],
  },
  {
    label: 'Defensive / Blue Team',
    slug: 'blue-team',
    description: 'Tools and techniques defenders use to monitor systems and protect infrastructure.',
    topicSlugs: ['network-security', 'security-operations', 'threat-intelligence', 'incident-response-forensics', 'cloud-security'],
  },
  {
    label: 'Offensive / Red Team',
    slug: 'red-team',
    description: 'How attackers discover and exploit weaknesses — for those interested in adversarial thinking.',
    topicSlugs: ['penetration-testing', 'social-engineering', 'application-security', 'system-os-security', 'network-security'],
  },
  {
    label: 'Policy & Risk',
    slug: 'policy-risk',
    description: 'The strategic and governance side of cybersecurity — frameworks, compliance, and ethics.',
    topicSlugs: ['risk-assessment-frameworks', 'grc-data-privacy', 'ethics-of-cybersecurity', 'threat-intelligence'],
  },
  {
    label: 'Edge Case',
    slug: 'edge-case',
    description: 'Critical topics unlikely to appear in coursework — areas becoming increasingly important in modern security.',
    topicSlugs: ['ai-ml-security', 'iot-physical-security'],
  },
]
