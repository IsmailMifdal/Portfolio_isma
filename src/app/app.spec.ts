import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DeferBlockState, TestBed } from '@angular/core/testing';
import { App } from './app';
import { ChatService } from './chat/chat.service';
import { PROFILE, profileAsKnowledge } from './data/profile';
import { PROFILE_EN } from './data/profile.en';
import { I18n } from './i18n';

/** Les sections sous la ligne de flottaison sont en @defer : on les affiche pour les tester. */
/** Réponse type de /api/chat. */
const reply = (text: string, remaining = 19, session = 'jeton-1') => ({
  reply: text,
  session,
  remaining,
  max: 20,
  expiresAt: Date.now() + 45 * 60_000,
});

async function renderAll() {
  const fixture = TestBed.createComponent(App);
  for (const block of await fixture.getDeferBlocks()) await block.render(DeferBlockState.Complete);
  await fixture.whenStable();
  return fixture;
}

describe('Portfolio', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    localStorage.clear();
    localStorage.setItem('lang', 'fr');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('affiche le nom et toutes les sections', async () => {
    const fixture = await renderAll();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain(PROFILE.lastName);
    for (const id of ['accueil', 'apropos', 'competences', 'experience', 'formation', 'certifications', 'projets', 'contact']) {
      expect(el.querySelector(`#${id}`), id).toBeTruthy();
    }
  });

  it('affiche les projets (ou un état vide propre s’il n’y en a pas)', async () => {
    const fixture = await renderAll();
    const text = (fixture.nativeElement as HTMLElement).querySelector('#projets')?.textContent ?? '';
    expect(text).toContain(PROFILE.projects.length ? PROFILE.projects[0].name : 'Projets en cours de sélection');
  });

  it("n'appelle que /api/chat (jamais OpenAI directement depuis le navigateur)", async () => {
    const chat = TestBed.inject(ChatService);
    const http = TestBed.inject(HttpTestingController);
    const pending = chat.send('Quel est ton parcours ?');
    const req = http.expectOne('/api/chat');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.messages.at(-1)).toEqual({ role: 'user', content: 'Quel est ton parcours ?' });
    req.flush(reply('Ismail est développeur full-stack.'));
    await pending;
    expect(chat.messages().at(-1)).toEqual({ role: 'assistant', content: 'Ismail est développeur full-stack.' });
    http.verify();
  });

  it('affiche un message clair si l’assistant n’est pas configuré', async () => {
    const chat = TestBed.inject(ChatService);
    const http = TestBed.inject(HttpTestingController);
    const pending = chat.send('Bonjour');
    http.expectOne('/api/chat').flush({ error: 'x' }, { status: 503, statusText: 'Unavailable' });
    await pending;
    expect(chat.error()).toContain('pas encore configuré');
  });

  it('bascule tout le site en anglais', async () => {
    const fixture = await renderAll();
    const el = fixture.nativeElement as HTMLElement;
    TestBed.inject(I18n).set('en');
    await fixture.whenStable();
    expect(document.documentElement.lang).toBe('en');
    expect(el.querySelector('#apropos')?.textContent).toContain('Who');
    expect(el.querySelector('#experience')?.textContent).toContain(PROFILE_EN.experiences[0].role);
    expect(el.querySelector('#contact')?.textContent).toContain('Download my CV');
    expect(localStorage.getItem('lang')).toBe('en');
  });

  it('demande au chatbot de répondre dans la langue du site', async () => {
    TestBed.inject(I18n).set('en');
    const chat = TestBed.inject(ChatService);
    const http = TestBed.inject(HttpTestingController);
    const pending = chat.send('Hello');
    const req = http.expectOne('/api/chat');
    expect(req.request.body.lang).toBe('en');
    req.flush({ error: 'x' }, { status: 503, statusText: 'Unavailable' });
    await pending;
    expect(chat.error()).toContain('isn’t set up yet');
  });
});

describe('Sessions du chatbot (20 questions, 45 minutes)', () => {
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('lang', 'fr');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('renvoie le jeton de session à chaque question et affiche le compteur', async () => {
    const chat = TestBed.inject(ChatService);
    const http = TestBed.inject(HttpTestingController);
    let pending = chat.send('Bonjour');
    let req = http.expectOne('/api/chat');
    expect(req.request.body.session).toBeNull();
    req.flush(reply('Salut !', 19, 'jeton-A'));
    await pending;
    expect(chat.remaining()).toBe(19);

    pending = chat.send('Votre rythme ?');
    req = http.expectOne('/api/chat');
    expect(req.request.body.session).toBe('jeton-A');
    req.flush(reply('2 semaines / 1 semaine', 18, 'jeton-B'));
    await pending;
    expect(chat.remaining()).toBe(18);
    expect(JSON.parse(localStorage.getItem('portfolio-chat-session')!).token).toBe('jeton-B');
  });

  it('après la 20e question, bloque la saisie et propose de me contacter', async () => {
    const fixture = await renderAll();
    const chat = TestBed.inject(ChatService);
    const http = TestBed.inject(HttpTestingController);
    const pending = chat.send('Dernière question');
    http.expectOne('/api/chat').flush(reply('Avec plaisir.', 0));
    await pending;
    expect(chat.limitReached()).toBe(true);

    // Toute nouvelle question est ignorée, sans appel réseau
    await chat.send('Encore une ?');
    http.expectNone('/api/chat');

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.fab')!.click();
    await fixture.whenStable();
    const panel = (fixture.nativeElement as HTMLElement).querySelector('app-chat-widget .panel')!;
    expect(panel.querySelector('.limit')?.textContent).toContain('20 questions');
    expect(panel.querySelector('.limit a[href^="mailto:"]')).toBeTruthy();
    expect(panel.querySelector<HTMLInputElement>('input[name="question"]')!.disabled).toBe(true);
  });

  it('si le serveur refuse (limite atteinte), la question est retirée et la saisie bloquée', async () => {
    const chat = TestBed.inject(ChatService);
    const http = TestBed.inject(HttpTestingController);
    const pending = chat.send('Question de trop');
    http
      .expectOne('/api/chat')
      .flush({ code: 'session_limit', remaining: 0, expiresAt: Date.now() + 60_000 }, { status: 429, statusText: 'Too Many' });
    await pending;
    expect(chat.limitReached()).toBe(true);
    expect(chat.messages()).toEqual([]);
  });

  it('quand la session de 45 min est terminée, repart sur une nouvelle session et repose la question', async () => {
    const chat = TestBed.inject(ChatService);
    const http = TestBed.inject(HttpTestingController);
    let pending = chat.send('Bonjour');
    http.expectOne('/api/chat').flush(reply('Bonjour !', 19, 'vieux-jeton'));
    await pending;

    pending = chat.send('Vous êtes mobile ?');
    http
      .expectOne('/api/chat')
      .flush({ code: 'session_expired', remaining: 0, expiresAt: Date.now() }, { status: 403, statusText: 'Forbidden' });
    await Promise.resolve();
    await new Promise((r) => setTimeout(r));
    const retry = http.expectOne('/api/chat');
    expect(retry.request.body.session).toBeNull();
    expect(retry.request.body.messages).toEqual([{ role: 'user', content: 'Vous êtes mobile ?' }]);
    retry.flush(reply('Oui, dans toute la France.', 19, 'nouveau-jeton'));
    await pending;
    expect(chat.notice()).toContain('45 minutes');
    expect(chat.messages().map((m) => m.content)).toEqual(['Vous êtes mobile ?', 'Oui, dans toute la France.']);
  });

  it('n’enchaîne pas sur une session déjà terminée au retour sur le site', () => {
    localStorage.setItem(
      'portfolio-chat-session',
      JSON.stringify({ messages: [{ role: 'user', content: 'ancien' }], token: 't', remaining: 3, expiresAt: Date.now() - 1 }),
    );
    const chat = TestBed.inject(ChatService);
    expect(chat.messages()).toEqual([]);
    expect(chat.remaining()).toBeNull();
  });

  it('reprend une session encore active (même après fermeture de l’onglet)', () => {
    localStorage.setItem(
      'portfolio-chat-session',
      JSON.stringify({ messages: [{ role: 'user', content: 'Bonjour' }], token: 't', remaining: 7, expiresAt: Date.now() + 60_000 }),
    );
    const chat = TestBed.inject(ChatService);
    expect(chat.messages()).toHaveLength(1);
    expect(chat.remaining()).toBe(7);
  });
});

describe('Recherche d’alternance', () => {
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('lang', 'fr');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('affiche le rythme, la mobilité et le véhicule dès l’en-tête (FR et EN)', async () => {
    const fixture = await renderAll();
    const facts = () => (fixture.nativeElement as HTMLElement).querySelector('#accueil .facts')?.textContent ?? '';
    expect(facts()).toContain('2 semaines en entreprise / 1 semaine à l’école');
    expect(facts()).toContain('toute la France');
    expect(facts()).toContain('Véhiculé');
    TestBed.inject(I18n).set('en');
    await fixture.whenStable();
    expect(facts()).toContain('2 weeks at the company / 1 week at school');
    expect(facts()).toContain('anywhere in France');
  });

  it('ne mentionne plus Valbonne nulle part (site et chatbot)', async () => {
    const fixture = await renderAll();
    expect((fixture.nativeElement as HTMLElement).textContent).not.toMatch(/Valbonne/);
    expect(profileAsKnowledge()).not.toMatch(/Valbonne/);
    expect(profileAsKnowledge(PROFILE_EN)).not.toMatch(/Valbonne/);
  });
});

describe('Projet PR Sentinel', () => {
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('lang', 'fr');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('s’affiche en grand juste après PADEL, avec son code et sa démo', async () => {
    const fixture = await renderAll();
    const cards = [...(fixture.nativeElement as HTMLElement).querySelectorAll('#projets .project')];
    expect(cards[0].textContent).toContain('PADEL');
    const card = cards[1];
    expect(card.textContent).toContain('PR Sentinel');
    expect(card.classList).toContain('featured');
    expect(card.querySelector('.tag')?.textContent).toContain('IA + DevSecOps');
    expect(card.querySelector('.tag')?.textContent).not.toContain('Projet phare');
    const links = [...card.querySelectorAll<HTMLAnchorElement>('.links a')].map((a) => a.href);
    expect(links).toEqual(['https://github.com/IsmailMifdal/PR_sesssion', 'https://pr-sentinel-nine.vercel.app/']);
  });

  it('garde le bon contenu anglais pour chaque projet après l’ajout', () => {
    expect(PROFILE_EN.projects.map((p) => p.name)).toEqual(PROFILE.projects.map((p) => p.name));
    expect(PROFILE_EN.projects[1].tagline).toContain('pull request');
    expect(PROFILE_EN.projects[2].name).toBe('RestoVision');
  });

  it('est connu du chatbot, sans devenir un second « projet phare »', () => {
    const knowledge = profileAsKnowledge();
    expect(knowledge).toContain('PR Sentinel');
    expect(knowledge.match(/MON PROJET PHARE/g)).toHaveLength(1);
  });
});

describe('Certifications', () => {
  beforeEach(async () => {
    localStorage.clear();
    localStorage.setItem('lang', 'fr');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('affiche les 7 certifications, chacune avec son lien de vérification Coursera', async () => {
    const fixture = await renderAll();
    const section = (fixture.nativeElement as HTMLElement).querySelector('#certifications')!;
    const cards = section.querySelectorAll('.cert');
    expect(cards).toHaveLength(PROFILE.certifications.length);
    expect(PROFILE.certifications).toHaveLength(7);
    for (const [i, c] of PROFILE.certifications.entries()) {
      const link = cards[i].querySelector<HTMLAnchorElement>('a.verify')!;
      expect(link.href).toBe(c.url);
      expect(link.href).toMatch(/^https:\/\/www\.coursera\.org\/account\/accomplishments\//);
      expect(link.href).toContain(c.credentialId);
      expect(link.rel).toContain('noopener');
      expect(cards[i].textContent).toContain(c.name);
    }
  });

  it('a un lien dans le menu et se traduit en anglais', async () => {
    const fixture = await renderAll();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('a[href="#certifications"]')).toBeTruthy();
    TestBed.inject(I18n).set('en');
    await fixture.whenStable();
    const text = el.querySelector('#certifications')?.textContent ?? '';
    expect(text).toContain('Verify');
    expect(text).toContain('Specialization');
    expect(text).not.toContain('Spécialisation');
  });

  it('sont connues du chatbot', () => {
    const knowledge = profileAsKnowledge();
    expect(knowledge).toContain('## Certifications');
    for (const c of PROFILE.certifications) expect(knowledge).toContain(c.name);
  });
});

describe('Base de connaissances du chatbot', () => {
  const knowledge = profileAsKnowledge();

  it('couvre parcours, compétences, architectures et web services', () => {
    for (const title of ['Expériences professionnelles', 'Parcours académique', 'Compétences', 'Architectures logicielles', 'Web services', 'Projets']) {
      expect(knowledge).toContain(`## ${title}`);
    }
    for (const g of PROFILE.skillGroups) expect(knowledge).toContain(g.title);
  });

  it('ne transmet jamais les textes « À compléter » (pour que l’IA n’invente rien)', () => {
    expect(knowledge).not.toContain('À compléter');
  });
});
