import type { TopicCategory } from '@/types/topic'

export const CATEGORY_META: Record<
  TopicCategory,
  { label: string; tagline: string; description: string; hub_description: string[] }
> = {
  build_and_secure: {
    label: 'Build & Secure',
    tagline: 'Design and harden systems from the ground up.',
    description:
      'These topics cover the technologies and practices used to design, implement, and maintain secure digital systems. Rather than reacting to attacks after they occur, this category emphasizes building security directly into networks, applications, operating systems, and modern infrastructure.',
    hub_description: [
      'The Build & Secure category focuses on the technologies and practices used to design, implement, and maintain secure digital systems. Rather than reacting to attacks after they occur, these topics emphasize building security directly into networks, applications, operating systems, and modern infrastructure. Understanding how systems are constructed and how they can be protected at each layer is essential for developing resilient technology.',
      'By integrating security into system architecture, software development, and infrastructure design, organizations can reduce vulnerabilities before attackers have the opportunity to exploit them.'
    ],
  },
  attack_and_defend: {
    label: 'Attack & Defend',
    tagline: 'Understand attacks. Learn to detect and respond.',
    description:
      'These topics explore the techniques attackers use to exploit systems as well as the tools and processes defenders rely on to identify threats, investigate incidents, and protect infrastructure. Understanding both sides is essential to security work.',
    hub_description: [
      'The Attack & Defend category focuses on understanding how cyber attacks occur and how organizations detect and respond to them. These topics explore the techniques attackers use to exploit systems as well as the tools and processes defenders rely on to identify threats, investigate incidents, and protect infrastructure.',
      'Even well-designed systems can still be targeted by attackers. By understanding how attacks work and how security teams detect and respond to them, organizations can identify weaknesses, reduce the impact of incidents, and strengthen their overall defenses against evolving cyber threats.',
    ],
  },
  strategy_and_governance: {
    label: 'Strategy & Governance',
    tagline: 'Manage risk. Shape policy. Guide decisions.',
    description:
      'These topics cover how organizations manage cybersecurity risk, develop policies, and guide security decisions at a strategic level — including frameworks, regulatory requirements, and the ethical considerations that shape security programs.',
    hub_description: [
      'The Strategy & Governance category focuses on how organizations manage cybersecurity risk, develop policies, and guide security decisions at a strategic level. These topics explore the frameworks, regulatory requirements, and ethical considerations that shape how security programs are designed and maintained.',
      'Cybersecurity decisions often involve balancing technical risks, legal obligations, and organizational priorities. Effective governance and risk management help organizations protect sensitive data, comply with regulations, and build security programs that support long-term operational goals.',
    ],
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
  topicFocus: Record<string, string>
  color: string
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    label: 'Foundational',
    slug: 'foundational',
    description:
      'Build the core technical knowledge that shows up across nearly every area of cybersecurity. Best starting point if you want a strong, well-rounded foundation.',
    topicSlugs: ['network-security', 'cryptography', 'system-os-security', 'security-engineering', 'application-security'],
    topicFocus: {
      'network-security': 'Focus on how data moves and how attackers exploit networks',
      'cryptography': 'Focus on how encryption and hashing protect data',
      'system-os-security': 'Focus on how systems enforce access and isolate processes',
      'security-engineering': 'Focus on how to design systems with security built in',
      'application-security': 'Focus on how vulnerabilities appear in software and how to prevent them',
    },
    color: '#c8102e',
  },
  {
    label: 'Career-Focused',
    slug: 'career-focused',
    description:
      'Prioritize the skills most commonly expected in internships and entry-level roles. Focused on what employers actually look for.',
    topicSlugs: ['network-security', 'security-operations', 'cloud-security', 'incident-response-forensics', 'application-security'],
    topicFocus: {
      'network-security': 'Focus on analyzing traffic and identifying suspicious behavior',
      'security-operations': 'Focus on monitoring alerts and investigating security events',
      'cloud-security': 'Focus on identity management and common cloud misconfigurations',
      'incident-response-forensics': 'Focus on detecting, containing, and investigating breaches',
      'application-security': 'Focus on identifying common vulnerabilities in real-world systems',
    },
    color: '#a4804a',
  },
  {
    label: 'Defensive / Blue Team',
    slug: 'blue-team',
    description:
      'Learn how organizations detect, investigate, and respond to cyber threats. Focuses on monitoring systems and protecting infrastructure.',
    topicSlugs: ['network-security', 'security-operations', 'threat-intelligence', 'incident-response-forensics', 'cloud-security'],
    topicFocus: {
      'network-security': 'Focus on detecting suspicious traffic and lateral movement',
      'security-operations': 'Focus on monitoring systems and triaging alerts',
      'threat-intelligence': 'Focus on understanding attacker behavior and indicators of compromise',
      'incident-response-forensics': 'Focus on investigating incidents and analyzing evidence',
      'cloud-security': 'Focus on monitoring environments and securing configurations',
    },
    color: '#3b82f6',
  },
  {
    label: 'Offensive / Red Team',
    slug: 'red-team',
    description:
      'Explore how attackers find and exploit weaknesses in systems. Focused on testing defenses and thinking like an adversary.',
    topicSlugs: ['penetration-testing', 'social-engineering', 'application-security', 'system-os-security', 'network-security'],
    topicFocus: {
      'penetration-testing': 'Focus on finding and exploiting vulnerabilities in systems',
      'social-engineering': 'Focus on manipulating human behavior to gain access',
      'application-security': 'Focus on exploiting common web and software vulnerabilities',
      'system-os-security': 'Focus on privilege escalation and system misconfigurations',
      'network-security': 'Focus on scanning networks and moving between systems',
    },
    color: '#f97316',
  },
  {
    label: 'Policy & Risk',
    slug: 'policy-risk',
    description:
      'Understand how organizations manage risk, set security policies, and meet legal and ethical obligations. Focused on strategy, governance, and decision-making.',
    topicSlugs: ['risk-assessment-frameworks', 'grc-data-privacy', 'ethics-of-cybersecurity', 'threat-intelligence'],
    topicFocus: {
      'risk-assessment-frameworks': 'Focus on identifying risks and applying frameworks to manage them',
      'grc-data-privacy': 'Focus on managing policies, compliance, and sensitive data',
      'ethics-of-cybersecurity': 'Focus on responsible security practices and decision-making',
      'threat-intelligence': 'Focus on using threat insights to inform risk and strategy',
    },
    color: '#8b5cf6',
  },
  {
    label: 'Edge Case',
    slug: 'edge-case',
    description:
      'Explore important but often overlooked areas not typically covered in coursework. Great for expanding beyond the standard cybersecurity curriculum.',
    topicSlugs: ['threat-intelligence', 'ai-ml-security', 'iot-physical-security', 'security-engineering'],
    topicFocus: {
      'threat-intelligence': 'Focus on tracking emerging threats and attacker trends',
      'ai-ml-security': 'Focus on how machine learning systems can be attacked or manipulated',
      'iot-physical-security': 'Focus on securing connected devices and physical systems',
      'security-engineering': 'Focus on designing systems to be secure from the start',
    },
    color: '#10b981',
  },
]
