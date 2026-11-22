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
  photo: string; // chemin dans /public ; repli sur les initiales si absent
  pitch: string;
  about: string[];
  stats: { value: string; label: string }[];
  links: { github: string; linkedin?: string; email?: string; cv?: string };
  experiences: Experience[];
  education: Education[];
  skillGroups: SkillGroup[];
  architectures: { name: string; description: string }[];
  webServices: { name: string; description: string }[];
  projects: Project[];
  languages: { name: string; level: string }[];
}

export const PROFILE: Profile = {
  firstName: 'Ismail',
  lastName: 'Mifdal',
  title: 'Développeur Full-Stack · DevSecOps · IA',
  roles: [
    'Développeur Full-Stack',
    'Ingénieur DevSecOps',
    'Intégrateur IA',
    'Architecte logiciel en devenir',
  ],
  location: 'France', // À compléter : ville
  availability: 'À compléter : ex. « Ouvert à une alternance / un CDI à partir de … »',
  photo: 'profile.jpg',
  pitch:
    'Je conçois des applications web et mobiles de bout en bout, sécurisées dès la conception, ' +
    "et j'y intègre de l'IA utile : du modèle de vision entraîné sur le terrain au copilote RAG.",
  about: [
    'À compléter : 2 à 3 phrases sur ton parcours, ce qui te motive et le type de poste que tu vises.',
    "À compléter : ce qui te distingue (ex. livrer en production, sécurité de la chaîne CI/CD, IA appliquée).",
  ],
  stats: [
    { value: 'À compléter', label: "années d'expérience" },
    { value: 'À compléter', label: 'projets livrés' },
    { value: 'À compléter', label: 'technologies maîtrisées' },
  ],
  links: {
    github: 'https://github.com/IsmailMifdal',
    linkedin: '', // À compléter
    email: '', // À compléter
    cv: '', // ex. 'cv-ismail-mifdal.pdf' dans /public
  },

  experiences: [
    {
      role: 'À compléter : intitulé du poste',
      company: 'À compléter : entreprise',
      location: 'À compléter',
      period: 'À compléter',
      type: 'Alternance',
      summary: 'À compléter : mission en une phrase.',
      highlights: [
        'À compléter : réalisation chiffrée (ex. « temps de déploiement divisé par 3 »).',
        'À compléter : responsabilité ou résultat marquant.',
      ],
      stack: [],
    },
  ],

  education: [
    {
      degree: 'À compléter : diplôme (ex. Mastère Expert en développement logiciel)',
      school: 'À compléter : école',
      location: 'À compléter',
      period: 'À compléter',
      details: ['À compléter : spécialité, projets ou mentions.'],
    },
  ],

  // Compétences relevées dans tes dépôts GitHub : ajuste, retire ou complète librement.
  skillGroups: [
    {
      id: 'dev',
      title: 'Programmation',
      icon: '💻',
      description: 'Langages et frameworks pour le web, le mobile et le back-end.',
      items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'Dart', 'Go', 'SQL', 'Angular', 'React', 'Next.js', 'Flutter', 'React Native', 'NestJS', 'Spring Boot', 'Flask'],
    },
    {
      id: 'devsecops',
      title: 'DevSecOps & CI/CD',
      icon: '🛡️',
      description: "Automatiser, sécuriser et livrer : de l'image durcie à la supply chain signée.",
      items: ['Docker', 'Docker Compose', 'GitHub Actions', 'GHCR', 'Images multi-architectures', 'Signature d’images', 'SonarCloud', 'Durcissement (hardening)', 'Nginx / Caddy', 'Vercel', 'Railway'],
    },
    {
      id: 'ia',
      title: 'IA : intégration & entraînement',
      icon: '🤖',
      description: 'Intégrer des LLM dans des produits et entraîner des modèles sur des données réelles.',
      items: ['OpenAI API', 'RAG', 'pgvector / embeddings', 'Prompt engineering', 'Vision par ordinateur', 'RF-DETR', 'YOLO', 'ByteTrack', 'Étiquetage & fine-tuning'],
    },
    {
      id: 'agile',
      title: 'Gestion de projet & Agile',
      icon: '🧭',
      description: 'Cadrer, prioriser et livrer par itérations courtes.',
      items: ['Scrum', 'Kanban', 'Sprints & roadmap', 'User stories', 'Revues de code (PR)', 'Jira / Linear', 'Documentation technique'],
    },
    {
      id: 'data',
      title: 'Données & infrastructure',
      icon: '🗄️',
      description: 'Bases de données, messagerie et temps réel.',
      items: ['PostgreSQL', 'PostGIS', 'TimescaleDB', 'Redis', 'Supabase', 'Prisma', 'JPA / Hibernate', 'Flyway', 'MQTT', 'WebSocket'],
    },
  ],

  architectures: [
    { name: 'Microservices & API Gateway', description: 'Services découpés par domaine derrière une passerelle, une base par service.' },
    { name: 'Architecture hexagonale / en couches', description: 'Domaine métier isolé des frameworks, testable et remplaçable.' },
    { name: 'Edge + Cloud (IoT)', description: "Traitement vidéo en local, seuls des événements partent vers le cloud via MQTT." },
    { name: 'Event-driven & temps réel', description: 'Événements, WebSocket/STOMP et tâches planifiées.' },
    { name: 'Monorepo full-stack', description: 'API, back-office et application mobile dans un même dépôt avec une CI commune.' },
  ],

  webServices: [
    { name: 'REST', description: 'API versionnées, validation des entrées, OpenAPI / Swagger.' },
    { name: 'Authentification', description: 'JWT + refresh rotatif, OAuth (Google / Apple), RBAC.' },
    { name: 'Temps réel', description: 'WebSocket, Socket.IO, STOMP, MQTT.' },
    { name: 'Paiement & webhooks', description: 'Passerelle de paiement, webhooks idempotents.' },
    { name: 'API d’IA', description: 'OpenAI, embeddings, RAG avec citations.' },
  ],

  // Projets : laissé vide volontairement, à remplir avec les dépôts que tu choisis.
  projects: [],

  languages: [
    { name: 'Français', level: 'À compléter' },
    { name: 'Anglais', level: 'À compléter' },
    { name: 'Arabe', level: 'À compléter' },
  ],
};

/** Texte brut du profil, utilisé comme base de connaissances par le chatbot. */
export function profileAsKnowledge(p: Profile = PROFILE): string {
  const todo = (s: string) => (s.includes('À compléter') ? '(non renseigné)' : s);
  const lines: string[] = [
    `# ${p.firstName} ${p.lastName} — ${p.title}`,
    `Localisation : ${todo(p.location)} | Disponibilité : ${todo(p.availability)}`,
    `Présentation : ${p.pitch} ${p.about.map(todo).join(' ')}`,
    `Liens : GitHub ${p.links.github}${p.links.linkedin ? ` | LinkedIn ${p.links.linkedin}` : ''}${p.links.email ? ` | Email ${p.links.email}` : ''}`,
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
  ];
  return lines.join('\n');
}
