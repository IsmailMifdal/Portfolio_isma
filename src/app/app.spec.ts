import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DeferBlockState, TestBed } from '@angular/core/testing';
import { App } from './app';
import { ChatService } from './chat/chat.service';
import { PROFILE, profileAsKnowledge } from './data/profile';

/** Les sections sous la ligne de flottaison sont en @defer : on les affiche pour les tester. */
async function renderAll() {
  const fixture = TestBed.createComponent(App);
  for (const block of await fixture.getDeferBlocks()) await block.render(DeferBlockState.Complete);
  await fixture.whenStable();
  return fixture;
}

describe('Portfolio', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('affiche le nom et toutes les sections', async () => {
    const fixture = await renderAll();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain(PROFILE.lastName);
    for (const id of ['accueil', 'apropos', 'competences', 'experience', 'formation', 'projets', 'contact']) {
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
    req.flush({ reply: 'Ismail est développeur full-stack.' });
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
