import { Injectable, computed, effect, signal } from '@angular/core';
import { PROFILE } from './data/profile';
import { PROFILE_EN } from './data/profile.en';

export type Lang = 'fr' | 'en';
const STORAGE_KEY = 'lang';

/** Textes de l'interface (le contenu du profil est dans data/profile*.ts). */
const UI = {
  fr: {
    docTitle: 'Ismail Mifdal — Développeur Full Stack · IA · DevSecOps',
    nav: { about: 'À propos', skills: 'Compétences', experience: 'Expériences', education: 'Formation', projects: 'Projets', contact: 'Contact', menu: 'Menu', theme: 'Basculer le thème', switchTo: 'Switch to English', mainNav: 'Navigation principale' },
    hero: { hello: 'Bonjour, je suis', seeProjects: 'Voir mes projets', ask: '✨ Poser une question à mon assistant IA', cv: 'Télécharger mon CV ↓', photoOf: 'Photo de', scrollDown: 'Descendre vers la suite', badges: ['🛡️ DevSecOps', '🤖 IA appliquée', '⚡ Full-Stack'], facts: ['📅 2 semaines en entreprise / 1 semaine à l’école', '🇫🇷 Mobile dans toute la France', '🚗 Véhiculé · Permis B'], factsLabel: 'L’alternance en bref' },
    about: { eyebrow: '01 · À propos', title: 'Qui', highlight: 'suis-je ?' },
    skills: { eyebrow: '02 · Compétences', title: 'Ma boîte', highlight: 'à outils', subtitle: 'Programmation, DevSecOps, IA, gestion de projet agile, architectures logicielles et web services.', tabs: 'Catégories de compétences', architectures: '🏗️ Architectures logicielles', webServices: '🔌 Web services' },
    experience: { eyebrow: '03 · Expériences', title: 'Parcours', highlight: 'professionnel' },
    education: { eyebrow: '04 · Formation', title: 'Parcours', highlight: 'académique' },
    projects: { eyebrow: '05 · Projets', title: 'Projets', highlight: 'réalisés', subtitle: 'Une sélection de projets publiés sur GitHub, du produit complet au prototype, avec leur démo en ligne.', featured: '⭐ Projet phare', code: 'Code ↗', demo: 'Démo en ligne ↗', previewOf: 'Aperçu de', emptyTitle: 'Projets en cours de sélection', emptyText: 'En attendant, tous mes dépôts sont sur GitHub.', seeGithub: 'Voir mon GitHub ↗' },
    contact: { eyebrow: '06 · Contact', title: 'Travaillons', highlight: 'ensemble', subtitle: "Un poste, une alternance, un projet ? Écrivez-moi, ou interrogez d'abord mon assistant IA sur mon parcours.", cv: '📄 Télécharger mon CV', ask: '✨ Demander à mon assistant', footer: 'Construit avec Angular · Assistant propulsé par OpenAI' },
    chat: {
      title: 'Discuter avec', subtitle: 'Mon parcours, mes compétences, mes projets', reset: 'Nouvelle conversation', close: "Fermer l'assistant", open: 'Demandez-moi : ouvrir l’assistant IA', fab: 'Demandez-moi', dialog: 'Assistant IA', typing: "L'assistant écrit", placeholder: 'Votre question…', question: 'Votre question', send: 'Envoyer',
      welcome: (name: string) => `Bonjour 👋 Moi c'est ${name}. Merci de passer sur mon portfolio ! Posez-moi vos questions sur mon parcours, mes expériences ou ce que je sais faire : je vous réponds avec plaisir.`,
      suggestions: ['Pouvez-vous vous présenter ?', 'Quelle expérience avez-vous en Java / Angular ?', "Comment intégrez-vous l'IA dans vos projets ?", 'Quel type d’alternance recherchez-vous ?', 'Pourquoi devrais-je vous recruter ?'],
      disclaimer: 'Réponses générées par IA, en mon nom, à partir de mon parcours réel.',
      session: {
        remaining: (n: number) => `${n} question${n > 1 ? 's' : ''} restante${n > 1 ? 's' : ''}`,
        until: (time: string) => `session jusqu'à ${time}`,
        limitTitle: 'Merci pour toutes ces questions !',
        limit: (max: number, time: string) =>
          `Vous avez posé les ${max} questions de cette session. Une nouvelle session sera disponible à ${time}. D'ici là, écrivez-moi directement, je vous réponds personnellement :`,
        expired: 'Votre session de 45 minutes est terminée : une nouvelle conversation commence.',
        email: '✉️ M’écrire',
      },
      errors: { rate: 'Beaucoup de questions depuis votre connexion : réessayez un peu plus tard.', setup: "L'assistant n'est pas encore configuré. Revenez bientôt !", generic: "L'assistant est momentanément indisponible. Réessayez plus tard." },
    },
  },
  en: {
    docTitle: 'Ismail Mifdal — Full Stack Developer · AI · DevSecOps',
    nav: { about: 'About', skills: 'Skills', experience: 'Experience', education: 'Education', projects: 'Projects', contact: 'Contact', menu: 'Menu', theme: 'Toggle theme', switchTo: 'Passer en français', mainNav: 'Main navigation' },
    hero: { hello: 'Hi, I’m', seeProjects: 'See my projects', ask: '✨ Ask my AI assistant a question', cv: 'Download my CV ↓', photoOf: 'Photo of', scrollDown: 'Scroll down', badges: ['🛡️ DevSecOps', '🤖 Applied AI', '⚡ Full-Stack'], facts: ['📅 2 weeks at the company / 1 week at school', '🇫🇷 Open to roles anywhere in France', '🚗 Own car · Driving licence'], factsLabel: 'Work-study key facts' },
    about: { eyebrow: '01 · About', title: 'Who', highlight: 'am I?' },
    skills: { eyebrow: '02 · Skills', title: 'My', highlight: 'toolbox', subtitle: 'Programming, DevSecOps, AI, agile project management, software architecture and web services.', tabs: 'Skill categories', architectures: '🏗️ Software architectures', webServices: '🔌 Web services' },
    experience: { eyebrow: '03 · Experience', title: 'Professional', highlight: 'experience' },
    education: { eyebrow: '04 · Education', title: 'Academic', highlight: 'background' },
    projects: { eyebrow: '05 · Projects', title: 'Selected', highlight: 'projects', subtitle: 'A selection of projects published on GitHub, from complete products to prototypes, each with a live demo.', featured: '⭐ Flagship project', code: 'Code ↗', demo: 'Live demo ↗', previewOf: 'Preview of', emptyTitle: 'Projects coming soon', emptyText: 'In the meantime, all my repositories are on GitHub.', seeGithub: 'See my GitHub ↗' },
    contact: { eyebrow: '06 · Contact', title: 'Let’s work', highlight: 'together', subtitle: 'A job, a work-study position, a project? Write to me, or first ask my AI assistant about my background.', cv: '📄 Download my CV', ask: '✨ Ask my assistant', footer: 'Built with Angular · Assistant powered by OpenAI' },
    chat: {
      title: 'Chat with', subtitle: 'My background, skills and projects', reset: 'New conversation', close: 'Close the assistant', open: 'Ask me: open the AI assistant', fab: 'Ask me', dialog: 'AI assistant', typing: 'The assistant is typing', placeholder: 'Your question…', question: 'Your question', send: 'Send',
      welcome: (name: string) => `Hi 👋 I’m ${name}, thanks for stopping by my portfolio! Ask me anything about my background, my experience or what I can do: I’ll be happy to answer.`,
      suggestions: ['Could you introduce yourself?', 'What experience do you have with Java / Angular?', 'How do you use AI in your projects?', 'What kind of work-study position are you looking for?', 'Why should I hire you?'],
      disclaimer: 'AI-generated answers, on my behalf, based on my real background.',
      session: {
        remaining: (n: number) => `${n} question${n > 1 ? 's' : ''} left`,
        until: (time: string) => `session until ${time}`,
        limitTitle: 'Thanks for all your questions!',
        limit: (max: number, time: string) =>
          `You’ve asked the ${max} questions of this session. A new session will be available at ${time}. In the meantime, write to me directly and I’ll answer personally:`,
        expired: 'Your 45-minute session has ended: a new conversation is starting.',
        email: '✉️ Email me',
      },
      errors: { rate: 'Too many questions from your connection: please try again a little later.', setup: 'The assistant isn’t set up yet. Come back soon!', generic: 'The assistant is temporarily unavailable. Please try again later.' },
    },
  },
} as const;

export type UiText = (typeof UI)['fr'] | (typeof UI)['en'];

/** Langue du site : choix mémorisé, sinon langue du navigateur (français par défaut). */
@Injectable({ providedIn: 'root' })
export class I18n {
  readonly lang = signal<Lang>(this.initial());
  readonly t = computed<UiText>(() => UI[this.lang()]);
  readonly profile = computed(() => (this.lang() === 'en' ? PROFILE_EN : PROFILE));

  constructor() {
    effect(() => {
      const lang = this.lang();
      document.documentElement.lang = lang;
      document.title = UI[lang].docTitle;
    });
  }

  toggle(): void {
    this.set(this.lang() === 'fr' ? 'en' : 'fr');
  }

  set(lang: Lang): void {
    this.lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* stockage indisponible : le choix vaut pour la session */
    }
  }

  private initial(): Lang {
    try {
      const fromUrl = new URLSearchParams(location.search).get('lang');
      if (fromUrl === 'fr' || fromUrl === 'en') return fromUrl;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'fr' || saved === 'en') return saved;
    } catch {
      /* ignore */
    }
    return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  }
}
