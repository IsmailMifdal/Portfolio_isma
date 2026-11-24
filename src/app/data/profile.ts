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
  type?: string; // ex. « Stage », « CDD », « Internship »
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
  emoji?: string; // icône de la bannière quand il n'y a pas d'image
  year?: string;
  featured?: boolean;
}

/** Certification publiée sur LinkedIn, vérifiable en ligne (Coursera). */
export interface Certification {
  name: string;
  issuer: string;
  /** Mois d'obtention, au format MM/AAAA. */
  date: string;
  /** « Certificat » ou « Spécialisation » (parcours de plusieurs cours). */
  kind: string;
  credentialId: string;
  url: string;
  /** Compétences associées sur LinkedIn (seulement si elles y sont indiquées). */
  skills?: string[];
  /** Mise en avant dans la grille (les plus proches de mon profil : Java/Spring et DevOps). */
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
  certifications: Certification[];
  skillGroups: SkillGroup[];
  architectures: { name: string; description: string }[];
  webServices: { name: string; description: string }[];
  projects: Project[];
  /** Projets connus du chatbot mais pas (encore) affichés dans la section Projets. */
  assistantOnlyProjects: Project[];
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
  location: 'Ouvert à toute offre dans la France entière',
  availability:
    'Alternance 1 an (Master 2) · disponible immédiatement · rythme 2 semaines entreprise / 1 semaine école · véhiculé · permis B',
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
    {
      role: 'Développeur Mobile React Native',
      company: 'Marsa Maroc',
      location: 'Casablanca, Maroc · hybride',
      period: '09/2023 – 10/2023',
      type: 'Stage',
      summary:
        'Application mobile multiplateforme (Android/iOS) de suivi du parc d’imprimantes : statut, disponibilité et maintenance.',
      highlights: [
        'Définition des spécifications fonctionnelles et techniques avec les équipes IT de Marsa Maroc.',
        'Développement de l’application en React Native et intégration de l’API back-end (Node.js / Express).',
        'Authentification et gestion des utilisateurs par rôles et permissions.',
        'Tests, débogage et optimisation des performances et de l’expérience utilisateur.',
      ],
      stack: ['React Native', 'JavaScript', 'Node.js', 'Express', 'Firebase', 'MongoDB', 'GraphQL', 'Docker', 'Git'],
    },
    {
      role: 'Développeur Java',
      company: 'ONEE – Branche Électricité',
      location: 'Casablanca, Maroc · hybride',
      period: '08/2022 – 09/2022',
      type: 'Stage',
      summary:
        'Plateforme collaborative de gestion des connaissances et de partage d’expertise pour les équipes de l’ONEE (Office national de l’électricité et de l’eau potable).',
      highlights: [
        'Analyse des besoins, rédaction du cahier des charges et modélisation UML de l’architecture.',
        'Développement de l’application en Spring Boot / Thymeleaf, avec gestion des rôles et permissions (Spring Security).',
        'Tests unitaires et d’intégration (JUnit), puis déploiement de l’application.',
        'Travail en mode Agile (Scrum).',
      ],
      stack: ['Java', 'Spring Boot', 'Spring Security', 'Spring Data JPA', 'Thymeleaf', 'Maven', 'JUnit', 'Git'],
    },
  ],

  education: [
    {
      degree: 'Mastère Expert en Développement Full Stack (Master 2 en alternance)',
      school: 'Sophia Ynov Campus',
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

  // Recopiées depuis LinkedIn (« Licences et certifications »), de la plus récente à la plus ancienne.
  certifications: [
    {
      name: 'Building Scalable Java Microservices with Spring Boot and Spring Cloud',
      issuer: 'Google Cloud',
      date: '11/2023',
      kind: 'Certificat',
      credentialId: 'FXCYZ555TTJZ',
      url: 'https://www.coursera.org/account/accomplishments/certificate/FXCYZ555TTJZ',
      featured: true,
    },
    {
      name: 'Machine Learning with Python',
      issuer: 'IBM',
      date: '11/2023',
      kind: 'Certificat',
      credentialId: 'YK5KM44ULNEL',
      url: 'https://www.coursera.org/account/accomplishments/certificate/YK5KM44ULNEL',
    },
    {
      name: 'Developing Back-End Apps with Node.js and Express',
      issuer: 'IBM',
      date: '04/2023',
      kind: 'Certificat',
      credentialId: 'B4D6395QJCSW',
      url: 'https://www.coursera.org/account/accomplishments/certificate/B4D6395QJCSW',
    },
    {
      name: 'Advanced React',
      issuer: 'Meta',
      date: '04/2023',
      kind: 'Certificat',
      credentialId: 'VJP5MQ8KA3BY',
      url: 'https://www.coursera.org/account/accomplishments/certificate/VJP5MQ8KA3BY',
    },
    {
      name: 'Android App Development',
      issuer: 'Vanderbilt University',
      date: '03/2023',
      kind: 'Spécialisation',
      credentialId: 'P4XH3SCEWJ2D',
      url: 'https://www.coursera.org/account/accomplishments/specialization/certificate/P4XH3SCEWJ2D',
      skills: ['Android Development'],
    },
    {
      name: 'IBM DevOps, Cloud, and Agile Foundations',
      issuer: 'IBM',
      date: '03/2023',
      kind: 'Spécialisation',
      credentialId: 'DGDCX2C6YK2L',
      url: 'https://www.coursera.org/account/accomplishments/specialization/certificate/DGDCX2C6YK2L',
      skills: ['Agile Development', 'Cloud Computing', 'DevOps'],
      featured: true,
    },
    {
      name: 'Python Functions, Files, and Dictionaries',
      issuer: 'University of Michigan',
      date: '09/2022',
      kind: 'Certificat',
      credentialId: 'DNRXEDUKKMA7',
      url: 'https://www.coursera.org/account/accomplishments/certificate/DNRXEDUKKMA7',
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
      items: ['Angular', 'TypeScript', 'React', 'Next.js', 'React Native', 'Flutter', 'Dart', 'HTML5', 'CSS3 / SCSS', 'JavaScript'],
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
      items: ['MySQL', 'PostgreSQL', 'PostGIS', 'MongoDB', 'Firebase', 'Redis', 'ChromaDB', 'Prisma', 'Hibernate (JPA)'],
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

  projects: [
    {
      name: 'PADEL',
      emoji: '🎾',
      year: '2026',
      featured: true,
      tagline: 'Application mobile de matching entre joueurs et de réservation de terrains',
      description:
        'Une plateforme complète pour le padel au Maroc : trouver des clubs autour de soi, réserver un créneau en temps réel, ' +
        'payer en ligne et rejoindre des matchs ouverts adaptés à son niveau. Appli joueur, espace club et back-office admin.',
      highlights: [
        'Zéro double-réservation : verrou Redis + contrainte PostgreSQL EXCLUDE (GiST).',
        'Clubs géolocalisés (PostGIS), paiement CMI, chat WebSocket, notifications push.',
        'Mode démo pour visiteurs : compte invité prérempli en un clic, données rafraîchies chaque nuit.',
        'CI GitHub Actions (API, back-office, appli), déploiement Railway + Vercel.',
      ],
      stack: ['NestJS', 'PostgreSQL', 'PostGIS', 'Prisma', 'Redis', 'Flutter', 'Next.js', 'Docker', 'GitHub Actions'],
      repo: 'https://github.com/IsmailMifdal/padell',
      demo: 'https://padel-app-olive.vercel.app',
    },
    {
      name: 'RestoVision',
      emoji: '📹',
      year: '2026',
      tagline: 'IA de vision branchée sur les caméras d’un restaurant',
      description:
        'Suit en direct l’état des tables et la file d’attente, et prévient l’équipe quand des clients attendent trop. ' +
        'La vidéo est analysée sur place (edge) : seuls des événements partent vers le cloud.',
      highlights: [
        'Détection et suivi : RF-DETR + ByteTrack, modèle entraîné sur les images du pilote.',
        'Edge Python → MQTT → Spring Boot (TimescaleDB) → WebSocket → écran de salle Angular.',
        'Démo en ligne avec simulateur : demo@restovision.local / demo1234.',
      ],
      stack: ['Python', 'RF-DETR', 'ByteTrack', 'MQTT', 'Spring Boot', 'TimescaleDB', 'Flyway', 'Angular', 'Docker'],
      repo: 'https://github.com/IsmailMifdal/resto-vision',
      demo: 'https://resto-vision.vercel.app',
    },
    {
      name: 'SkillCheck AI',
      emoji: '🎯',
      tagline: 'Copilote d’apprentissage : « teste-toi avant d’apprendre »',
      description:
        'On importe un cours (PDF ou texte), l’IA fait passer un diagnostic adaptatif, puis n’enseigne que les lacunes, ' +
        'avec des explications ancrées sur le document, avant un re-test qui chiffre la progression.',
      highlights: [
        'Détection des faux acquis en croisant confiance × justesse des réponses.',
        'RAG avec citations du document (Supabase pgvector + embeddings OpenAI).',
      ],
      stack: ['Next.js', 'TypeScript', 'Supabase', 'pgvector', 'OpenAI', 'RAG'],
      repo: 'https://github.com/IsmailMifdal/skillcheck-ai',
      demo: 'https://skillcheck-ai-psi.vercel.app',
    },
    {
      name: 'L’Odyssée',
      emoji: '🧭',
      tagline: 'Prototype d’app mobile d’exploration urbaine gamifiée',
      description:
        'On prépare sa liste de lieux à découvrir, on tamponne son carnet sur place, on débloque des pages secrètes ' +
        'et on transforme son carnet en souvenir imprimé. Parcours complet de l’onboarding au pack premium.',
      highlights: [
        'Une quinzaine d’écrans : carte, check-in, pépites cachées, classement, fil d’équipe, notifications.',
        'Transitions animées (Framer Motion) et design « carnet de voyage ».',
      ],
      stack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion'],
      repo: 'https://github.com/IsmailMifdal/lodyssee',
      demo: 'https://lodyssee.vercel.app',
    },
  ],

  // Projets du CV non affichés : le chatbot peut quand même en parler.
  assistantOnlyProjects: [
    {
      name: 'IA-DAF',
      tagline: 'Assistant IA multilingue (FR / EN / AR / ES) pour les démarches administratives en France (projet personnel, 2026)',
      description:
        'Guide les non-francophones : documents, étapes, délais et organisme compétent. Chatbot RAG : base vectorisée ' +
        '(ChromaDB + embeddings multilingues), orchestration LangChain et LLM Mistral 7B auto-hébergé via Ollama, derrière une architecture micro-services.',
      stack: ['Python', 'FastAPI', 'LangChain', 'ChromaDB', 'sentence-transformers', 'Ollama (Mistral 7B)', 'Spring Cloud Gateway', 'Eureka', 'Next.js', 'React', 'Docker Compose'],
      repo: 'https://github.com/IsmailMifdal/IADAF-YDAYS',
    },
  ],
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
    `Mobilité géographique : ${todo(p.location)} | Disponibilité : ${todo(p.availability)}`,
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
    '## Certifications (vérifiables en ligne sur Coursera, publiées sur LinkedIn)',
    ...p.certifications.map(
      (c) =>
        `- ${c.name} — ${c.issuer} (${c.kind}, ${c.date})${c.skills?.length ? `. Compétences : ${c.skills.join(', ')}` : ''}. Vérification : ${c.url}`,
    ),
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
    ...([...p.projects, ...p.assistantOnlyProjects].length
      ? [...p.projects, ...p.assistantOnlyProjects].map(
          (pr) =>
            `- ${pr.name}${pr.featured ? ' (MON PROJET PHARE, le plus abouti)' : ''}${pr.year ? ` (${pr.year})` : ''} — ${pr.tagline}. ${pr.description}` +
            `${pr.highlights?.length ? ` Points clés : ${pr.highlights.join(' ; ')}` : ''} Stack : ${pr.stack.join(', ')}.` +
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
