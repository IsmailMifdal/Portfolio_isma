/**
 * SOURCE UNIQUE du portfolio : le site l'affiche ET le chatbot (api/chat.ts) s'en sert
 * comme base de connaissances. Modifie ce fichier pour mettre à jour les deux.
 *
 * Les textes marqués « À compléter » sont des emplacements à remplir avec tes vraies infos.
 * Ce fichier ne doit dépendre d'aucun paquet Angular (il est aussi importé côté serveur).
 */

export interface Experience {
  role: string;
  company: string;
  location?: string;
  period: string; // ex. « Sept. 2024 – aujourd'hui »
  type?: 'Alternance' | 'Stage' | 'CDI' | 'CDD' | 'Freelance' | 'Projet';
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface Education {
  degree: string;
  school: string;
  location?: string;
  period: string;
  details?: string[];
}

export interface SkillGroup {
  id: string;
  title: string;
  icon: string; // emoji, pour rester léger
  description: string;
  items: string[];
}

export interface Project {
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  highlights?: string[];
  repo?: string; // URL GitHub
  demo?: string; // URL de démo en ligne
  image?: string; // chemin dans /public, ex. 'projects/padel.png'
  featured?: boolean;
}

export interface Profile {
  firstName: string;
  lastName: string;
  title: string;
  roles: string[]; // défilent dans l'en-tête
  location: string;
  availability: string;
  badge: string; // pastille courte de l'en-tête
  photo: string; // chemin dans /public ; repli sur les initiales si absent
  pitch: string;
  about: string[];
  stats: { value: string; label: string }[];
  links: { github: string; linkedin?: string; email?: string; schoolEmail?: string; phone?: string; cv?: string };
  experiences: Experience[];
  education: Education[];
  skillGroups: SkillGroup[];
  architectures: { name: string; description: string }[];
  webServices: { name: string; description: string }[];
  projects: Project[];
  languages: { name: string; level: string }[];
  interests: string[];
}

export const PROFILE: Profile = {
  firstName: 'Ismail',
  lastName: 'Mifdal',
  title: 'Développeur Full Stack · IA · DevSecOps',
  roles: [
    'Développeur Full Stack',
    'Java Spring Boot & Angular',
    'Intégrateur IA (RAG, LLM)',
    'DevSecOps & CI/CD',
  ],
  location: 'Valbonne · Sophia Antipolis',
  availability:
    'Alternance 1 an (Master 2) · disponible immédiatement · rythme 2 semaines entreprise / 1 semaine école · permis B',
  badge: 'Disponible immédiatement · Alternance Master 2',
  photo: 'profile.jpg',
  pitch:
    "Ingénieur en informatique, je conçois des applications web et mobiles de bout en bout, du back-end Java " +
    "ou Node à la mise en production, et j'y intègre de l'IA utile : RAG, LangChain, LLM auto-hébergés.",
  about: [
    'Ingénieur en Informatique et Réseaux (MIAGE, EMSI Casablanca, 2024), je suis aujourd’hui en Mastère Expert en Développement Full Stack à Sophia Ynov Campus.',
    'Plus d’un an d’expérience en production sur des plateformes métier (Java Spring Boot, Angular, micro-services), une expérience en agence web (PHP/Laravel, React, intégration URSSAF) et des projets personnels orientés IA (RAG, LangChain, LLM auto-hébergés).',
    'Autonome et rigoureux, je suis à l’aise du back-end au front-end comme sur la mise en production, le suivi des correctifs et le travail en Agile/Scrum. Je recherche une alternance pour mon Master 2, disponible immédiatement.',
  ],
  stats: [
    { value: '1 an+', label: "d'expérience en production" },
    { value: '500+', label: 'adhérents sur une plateforme livrée' },
    { value: '3', label: 'plateformes en production en agence' },
  ],
  links: {
    github: 'https://github.com/IsmailMifdal',
    linkedin: 'https://www.linkedin.com/in/ismail-mifdal',
    email: 'ismailmifdal12@gmail.com',
    schoolEmail: 'ismail.mifdal@ynov.com',
    phone: '+33 7 45 82 95 38',
    cv: 'cv-ismail-mifdal.pdf',
  },

  experiences: [
    {
      role: 'Développeur Full Stack',
      company: 'Codi-One (agence web)',
      location: 'Orléans, France',
      period: '07/2026 – 08/2026',
      type: 'Stage',
      summary: 'Développement et maintenance de trois plateformes en production pour une agence web.',
      highlights: [
        'Intervention sur trois plateformes en production : Promenons-nous, Stage Connect et 123LINK.',
        'Stage Connect : développement du dashboard et du coffre-fort DPAE (génération et transmission automatiques des DPAE, intégration URSSAF).',
        'Traitement des demandes d’évolution et des correctifs remontés par e-mail, en lien direct avec la direction.',
      ],
      stack: ['PHP', 'Laravel', 'MySQL', 'React', 'TypeScript', 'REST API', 'URSSAF (DPAE)', 'Git/GitHub'],
    },
    {
      role: 'Développeur Full Stack',
      company: 'FRMVB (fédération sportive)',
      location: 'Rabat, Maroc',
      period: '01/2025 – 08/2025',
      type: 'CDD',
      summary: 'Évolution, optimisation et mise en production de la plateforme de gestion de la fédération.',
      highlights: [
        'Mise en production de la plateforme, avec une amélioration de l’efficacité de 30 % ; suivi du déploiement en continu.',
        'Optimisation du code et des micro-services pour améliorer les performances et la scalabilité.',
        'Ajout de nouvelles fonctionnalités en concertation avec l’équipe métier de la fédération.',
        'Tests de régression et correction des anomalies avant et après mise en production.',
      ],
      stack: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'REST API', 'Spring Security', 'Hibernate (JPA)', 'MySQL', 'Docker', 'Micro-services'],
    },
    {
      role: 'Développeur Concepteur Full Stack',
      company: 'FRMVB (fédération sportive)',
      location: 'Rabat, Maroc',
      period: '03/2024 – 09/2024',
      type: 'Stage',
      summary: 'Stage de fin d’études : conception et développement de la plateforme de gestion de la fédération.',
      highlights: [
        'Conception et développement d’une plateforme de gestion utilisée par plus de 500 adhérents.',
        'Modélisation d’une base de données optimisée réduisant le temps de recherche de 40 %.',
        'Déploiement et tests permettant de réduire les erreurs de gestion de 25 %.',
        'Pilotage Agile/Scrum, diagrammes UML et gestion des exigences.',
      ],
      stack: ['Java', 'Spring Boot', 'Angular', 'TypeScript', 'HTML5/CSS3', 'REST API', 'Spring Security', 'Hibernate (JPA)', 'MySQL', 'Micro-services'],
    },
  ],

  education: [
    {
      degree: 'Mastère Expert en Développement Full Stack (Master 2 en alternance)',
      school: 'Sophia Ynov Campus',
      location: 'Valbonne, France',
      period: '2025 – 2027',
    },
    {
      degree: 'Diplôme d’Ingénieur – Informatique & Réseaux (MIAGE)',
      school: 'École Marocaine des Sciences de l’Ingénieur (EMSI)',
      location: 'Casablanca, Maroc',
      period: '2019 – 2024',
    },
    {
      degree: 'Baccalauréat Sciences Physiques-Chimie',
      school: 'Lycée Azhar',
      location: 'Casablanca, Maroc',
      period: '2018',
    },
  ],

  skillGroups: [
    {
      id: 'backend',
      title: 'Back-end',
      icon: '⚙️',
      description: 'API robustes et sécurisées, du monolithe aux micro-services.',
      items: ['Java', 'Spring Boot', 'Spring Security', 'Hibernate (JPA)', 'Spring Cloud Gateway', 'Eureka', 'PHP', 'Laravel', 'Node.js', 'NestJS', 'C#', 'ASP.NET', 'Python', 'Django', 'FastAPI', 'REST API'],
    },
    {
      id: 'frontend',
      title: 'Front-end & mobile',
      icon: '🎨',
      description: 'Interfaces web et mobiles réactives.',
      items: ['Angular', 'TypeScript', 'React', 'Next.js', 'Flutter', 'Dart', 'HTML5', 'CSS3 / SCSS', 'JavaScript'],
    },
    {
      id: 'ia',
      title: 'IA : intégration & entraînement',
      icon: '🤖',
      description: 'Intégrer des LLM dans des produits et exploiter des modèles sur des données réelles.',
      items: ['OpenAI API', 'Claude API', 'LangChain', 'RAG', 'Embeddings', 'ChromaDB', 'sentence-transformers', 'Ollama (Mistral 7B)', 'Hugging Face', 'Prompt engineering', 'Pandas / NumPy', 'Vision par ordinateur (RF-DETR, YOLO)'],
    },
    {
      id: 'devsecops',
      title: 'DevSecOps & CI/CD',
      icon: '🛡️',
      description: "Automatiser, sécuriser et livrer : de l'image Docker durcie au pipeline CI/CD.",
      items: ['Docker', 'Docker Compose', 'GitHub Actions', 'CI/CD', 'GHCR', 'Durcissement d’images', 'Signature d’images', 'SonarCloud', 'Vercel', 'Railway', 'Git / GitHub'],
    },
    {
      id: 'agile',
      title: 'Gestion de projet & Agile',
      icon: '🧭',
      description: 'Cadrer, prioriser et livrer par itérations, en lien avec le métier.',
      items: ['Agile / Scrum', 'UML', 'Gestion des exigences', 'Revues de code (PR)', 'Tests de régression', 'Postman', 'Suivi des correctifs'],
    },
    {
      id: 'data',
      title: 'Bases de données',
      icon: '🗄️',
      description: 'Modélisation, performance et données géographiques.',
      items: ['MySQL', 'PostgreSQL', 'PostGIS', 'Redis', 'ChromaDB', 'Prisma', 'Hibernate (JPA)'],
    },
  ],

  architectures: [
    { name: 'Micro-services & API Gateway', description: 'Services découpés par domaine, Spring Cloud Gateway et découverte de services avec Eureka.' },
    { name: 'Architecture RAG', description: 'Base vectorielle (ChromaDB + embeddings multilingues), orchestration LangChain et LLM auto-hébergé.' },
    { name: 'Architecture en couches (MVC)', description: 'Contrôleurs, services et accès aux données séparés (Spring Boot, Laravel, NestJS).' },
    { name: 'Temps réel & événements', description: 'WebSocket, notifications push et tâches planifiées.' },
    { name: 'Monorepo full-stack', description: 'API, back-office et application mobile dans un même dépôt avec une CI commune.' },
  ],

  webServices: [
    { name: 'REST', description: 'API REST documentées et testées (Postman, OpenAPI).' },
    { name: 'Sécurité', description: 'Spring Security, JWT, gestion des rôles.' },
    { name: 'Intégrations tierces', description: 'URSSAF (DPAE), paiement en ligne (CMI), webhooks.' },
    { name: 'Temps réel', description: 'WebSocket et notifications push.' },
    { name: 'API d’IA', description: 'OpenAI, Claude, LangChain, RAG avec embeddings.' },
  ],

  // Projets : à remplir avec les dépôts choisis.
  projects: [],

  languages: [
    { name: 'Français', level: 'Courant (C1)' },
    { name: 'Anglais', level: 'Avancé (B2)' },
    { name: 'Arabe', level: 'Langue maternelle' },
  ],
  interests: ['Boxe anglaise (rigueur & discipline)', 'Football (esprit d’équipe)'],
};

/** Texte brut du profil, utilisé comme base de connaissances par le chatbot. */
export function profileAsKnowledge(p: Profile = PROFILE): string {
  const todo = (s: string) => (s.includes('À compléter') ? '(non renseigné)' : s);
  const lines: string[] = [
    `# ${p.firstName} ${p.lastName} — ${p.title}`,
    `Localisation : ${todo(p.location)} | Disponibilité : ${todo(p.availability)}`,
    `Présentation : ${p.pitch} ${p.about.map(todo).join(' ')}`,
    `Liens : GitHub ${p.links.github}${p.links.linkedin ? ` | LinkedIn ${p.links.linkedin}` : ''}${p.links.email ? ` | Email ${p.links.email}` : ''}${p.links.schoolEmail ? ` | Email école ${p.links.schoolEmail}` : ''}${p.links.phone ? ` | Téléphone ${p.links.phone}` : ''}${p.links.cv ? ' | CV téléchargeable sur le site (bouton « Télécharger mon CV »)' : ''}`,
    '',
    '## Expériences professionnelles',
    ...p.experiences.map(
      (e) =>
        `- ${todo(e.role)} chez ${todo(e.company)} (${todo(e.period)}${e.type ? `, ${e.type}` : ''}) : ${todo(e.summary)} ` +
        `Réalisations : ${e.highlights.map(todo).join(' ; ')}. Stack : ${e.stack.join(', ') || 'non précisée'}.`,
    ),
    '',
    '## Parcours académique',
    ...p.education.map((e) => `- ${todo(e.degree)}, ${todo(e.school)} (${todo(e.period)}). ${(e.details ?? []).map(todo).join(' ')}`),
    '',
    '## Compétences',
    ...p.skillGroups.map((g) => `- ${g.title} : ${g.items.join(', ')}`),
    '',
    '## Architectures logicielles',
    ...p.architectures.map((a) => `- ${a.name} : ${a.description}`),
    '',
    '## Web services',
    ...p.webServices.map((w) => `- ${w.name} : ${w.description}`),
    '',
    '## Projets',
    ...(p.projects.length
      ? p.projects.map(
          (pr) =>
            `- ${pr.name} — ${pr.tagline}. ${pr.description} Stack : ${pr.stack.join(', ')}.` +
            `${pr.repo ? ` Code : ${pr.repo}.` : ''}${pr.demo ? ` Démo : ${pr.demo}.` : ''}`,
        )
      : ['(liste des projets pas encore renseignée)']),
    '',
    '## Langues',
    ...p.languages.map((l) => `- ${l.name} : ${todo(l.level)}`),
    '',
    `## Centres d'intérêt : ${p.interests.join(', ')}`,
  ];
  return lines.join('\n');
}
