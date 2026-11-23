/**
 * Version anglaise du profil. Les liens, noms propres, périodes et technologies viennent
 * de la version française (PROFILE) : seuls les textes sont traduits ici.
 * Ce fichier ne dépend d'aucun paquet Angular.
 */
import { PROFILE, Profile } from './profile';

const fr = PROFILE;

export const PROFILE_EN: Profile = {
  ...fr,
  title: 'Full Stack Developer · AI · DevSecOps',
  roles: ['Full Stack Developer', 'Java Spring Boot & Angular', 'AI integrator (RAG, LLM)', 'DevSecOps & CI/CD'],
  location: 'Valbonne · Sophia Antipolis, France',
  availability:
    'One-year work-study (Master 2) · available immediately · 2 weeks at the company / 1 week at school · driving licence',
  badge: 'Available now · Master 2 work-study',
  pitch:
    'Software engineer, I build web and mobile applications end to end, from Java or Node back-ends ' +
    'to production, and I add useful AI to them: RAG, LangChain, self-hosted LLMs.',
  about: [
    'Software and network engineer (MIAGE, EMSI Casablanca, 2024), I am now studying for a Master’s degree in Full Stack Development (Mastère Expert) at Sophia Ynov Campus.',
    'Over a year of production experience on business platforms (Java Spring Boot, Angular, microservices), web agency experience (PHP/Laravel, React, URSSAF integration) and AI-focused personal projects (RAG, LangChain, self-hosted LLMs).',
    'Autonomous and rigorous, I am comfortable from back-end to front-end, as well as with production releases, bug-fix follow-up and Agile/Scrum teamwork. I am looking for a work-study position for my Master 2, available immediately.',
  ],
  stats: [
    { value: '1 yr+', label: 'of production experience' },
    { value: '500+', label: 'members on a platform I delivered' },
    { value: '3', label: 'production platforms at a web agency' },
  ],

  experiences: [
    {
      ...fr.experiences[0],
      role: 'Full Stack Developer',
      company: 'Codi-One (web agency)',
      type: 'Internship',
      summary: 'Development and maintenance of three production platforms for a web agency.',
      highlights: [
        'Worked on three production platforms: Promenons-nous, Stage Connect and 123LINK.',
        'Stage Connect: built the dashboard and the DPAE vault (automatic generation and submission of hiring declarations, URSSAF integration).',
        'Handled change requests and bug fixes reported by email, working directly with management.',
      ],
    },
    {
      ...fr.experiences[1],
      role: 'Full Stack Developer',
      company: 'FRMVB (sports federation)',
      location: 'Rabat, Morocco',
      type: 'Fixed-term contract',
      summary: 'Evolution, optimisation and production release of the federation’s management platform.',
      highlights: [
        'Released the platform to production, improving efficiency by 30%; continuous deployment follow-up.',
        'Optimised code and microservices to improve performance and scalability.',
        'Added new features in close collaboration with the federation’s business team.',
        'Regression testing and bug fixing before and after production releases.',
      ],
      stack: fr.experiences[1].stack.map((s) => (s === 'Micro-services' ? 'Microservices' : s)),
    },
    {
      ...fr.experiences[2],
      role: 'Full Stack Software Designer & Developer',
      company: 'FRMVB (sports federation)',
      location: 'Rabat, Morocco',
      type: 'Final-year internship',
      summary: 'Final-year internship: design and development of the federation’s management platform.',
      highlights: [
        'Designed and built a management platform used by more than 500 members.',
        'Designed an optimised database, cutting search time by 40%.',
        'Deployment and testing that reduced management errors by 25%.',
        'Agile/Scrum project management, UML diagrams and requirements management.',
      ],
      stack: fr.experiences[2].stack.map((s) => (s === 'Micro-services' ? 'Microservices' : s)),
    },
  ],

  education: [
    {
      ...fr.education[0],
      degree: 'Master’s in Full Stack Development – “Mastère Expert” (Master 2, work-study)',
    },
    {
      ...fr.education[1],
      degree: 'Engineering Degree – Computer Science & Networks (MIAGE)',
      school: 'Moroccan School of Engineering Sciences (EMSI)',
      location: 'Casablanca, Morocco',
    },
    {
      ...fr.education[2],
      degree: 'French Baccalaureate – Physics & Chemistry',
      school: 'Lycée Azhar (high school)',
      location: 'Casablanca, Morocco',
    },
  ],

  skillGroups: [
    { ...fr.skillGroups[0], description: 'Robust, secure APIs, from monoliths to microservices.' },
    { ...fr.skillGroups[1], title: 'Front-end & mobile', description: 'Responsive web and mobile interfaces.' },
    {
      ...fr.skillGroups[2],
      title: 'AI: integration & training',
      description: 'Bringing LLMs into products and putting models to work on real-world data.',
      items: fr.skillGroups[2].items.map((s) => (s.startsWith('Vision par ordinateur') ? 'Computer vision (RF-DETR, YOLO)' : s)),
    },
    {
      ...fr.skillGroups[3],
      description: 'Automate, secure and ship: from hardened Docker images to CI/CD pipelines.',
      items: fr.skillGroups[3].items.map(
        (s) => ({ 'Durcissement d’images': 'Image hardening', 'Signature d’images': 'Image signing' })[s] ?? s,
      ),
    },
    {
      ...fr.skillGroups[4],
      title: 'Project management & Agile',
      description: 'Scope, prioritise and deliver in iterations, hand in hand with the business.',
      items: ['Agile / Scrum', 'UML', 'Requirements management', 'Code reviews (PRs)', 'Regression testing', 'Postman', 'Bug-fix follow-up'],
    },
    { ...fr.skillGroups[5], title: 'Databases', description: 'Data modelling, performance and geospatial data.' },
  ],

  architectures: [
    { name: 'Microservices & API Gateway', description: 'Domain-based services, Spring Cloud Gateway and service discovery with Eureka.' },
    { name: 'RAG architecture', description: 'Vector store (ChromaDB + multilingual embeddings), LangChain orchestration and a self-hosted LLM.' },
    { name: 'Layered architecture (MVC)', description: 'Separate controllers, services and data access (Spring Boot, Laravel, NestJS).' },
    { name: 'Real-time & events', description: 'WebSocket, push notifications and scheduled jobs.' },
    { name: 'Full-stack monorepo', description: 'API, back-office and mobile app in a single repository with a shared CI.' },
  ],

  webServices: [
    { name: 'REST', description: 'Documented and tested REST APIs (Postman, OpenAPI).' },
    { name: 'Security', description: 'Spring Security, JWT, role-based access.' },
    { name: 'Third-party integrations', description: 'URSSAF (DPAE), online payment (CMI), webhooks.' },
    { name: 'Real-time', description: 'WebSocket and push notifications.' },
    { name: 'AI APIs', description: 'OpenAI, Claude, LangChain, RAG with embeddings.' },
  ],

  projects: [
    {
      ...fr.projects[0],
      tagline: 'Mobile app to match padel players and book courts',
      description:
        'A complete padel platform for Morocco: find clubs nearby, book a court slot in real time, pay online ' +
        'and join open matches that fit your level. Player app, club area and admin back-office.',
      highlights: [
        'Zero double bookings: Redis lock + PostgreSQL EXCLUDE constraint (GiST).',
        'Geolocated clubs (PostGIS), CMI payment, WebSocket chat, push notifications.',
        'Visitor demo mode: one-click pre-filled guest account, data refreshed every night.',
        'GitHub Actions CI (API, back-office, app), deployed on Railway + Vercel.',
      ],
    },
    {
      ...fr.projects[1],
      tagline: 'Computer-vision AI plugged into a restaurant’s cameras',
      description:
        'Tracks table status and the waiting line live, and alerts the staff when guests wait too long. ' +
        'Video is analysed on site (edge): only events are sent to the cloud.',
      highlights: [
        'Detection and tracking: RF-DETR + ByteTrack, model trained on the pilot site’s images.',
        'Python edge → MQTT → Spring Boot (TimescaleDB) → WebSocket → Angular floor screen.',
        'Live demo with a simulator: demo@restovision.local / demo1234.',
      ],
    },
    {
      ...fr.projects[2],
      tagline: 'Learning copilot: “test yourself before you learn”',
      description:
        'Upload a course (PDF or text): the AI runs an adaptive diagnostic, then teaches only the gaps with ' +
        'explanations grounded in the document, before a re-test that measures progress.',
      highlights: [
        'Detects false knowledge by crossing confidence × correctness.',
        'RAG with citations from the document (Supabase pgvector + OpenAI embeddings).',
      ],
    },
    {
      ...fr.projects[3],
      name: 'L’Odyssée',
      tagline: 'Gamified urban-exploration mobile app prototype',
      description:
        'Build a list of places to discover, stamp your notebook on site, unlock secret pages and turn your ' +
        'notebook into a printed keepsake. Complete flow from onboarding to the premium pack.',
      highlights: [
        'About fifteen screens: map, check-in, hidden gems, leaderboard, team feed, notifications.',
        'Animated transitions (Framer Motion) and a “travel notebook” design.',
      ],
    },
  ],

  assistantOnlyProjects: fr.assistantOnlyProjects,

  languages: [
    { name: 'French', level: 'Fluent (C1)' },
    { name: 'English', level: 'Advanced (B2)' },
    { name: 'Arabic', level: 'Native' },
  ],
  interests: ['Boxing (rigour & discipline)', 'Football (team spirit)'],
};
