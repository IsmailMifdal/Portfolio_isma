import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import handler from '../../api/chat';
import { checkSession, decodeSession, encodeSession, MAX_QUESTIONS, SESSION_MS } from '../../api/_session';

const SECRET = 'secret-de-test';

/** Réponse HTTP minimale, compatible avec celle de Vercel. */
function fakeRes() {
  const res = {
    statusCode: 0,
    body: undefined as any,
    headers: {} as Record<string, string>,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(body: unknown) {
      res.body = body;
    },
    setHeader(name: string, value: string) {
      res.headers[name] = value;
    },
  };
  return res;
}

let ipCounter = 0;
async function ask(content: string, opts: { session?: string | null; lang?: string; ip?: string } = {}) {
  const res = fakeRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': opts.ip ?? `10.0.0.${++ipCounter}` },
      body: { messages: [{ role: 'user', content }], session: opts.session, lang: opts.lang },
    },
    res,
  );
  return res;
}

const openai = vi.fn();

beforeEach(() => {
  process.env['OPENAI_API_KEY'] = 'sk-test';
  process.env['CHAT_SESSION_SECRET'] = SECRET;
  openai.mockReset();
  openai.mockImplementation(async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: 'Réponse de test' } }] }),
  }));
  vi.stubGlobal('fetch', openai);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('Jeton de session', () => {
  it('se signe et se relit', () => {
    const s = { id: 'abc', start: 1_000, count: 3 };
    expect(decodeSession(encodeSession(s, SECRET), SECRET)).toEqual(s);
  });

  it('refuse un jeton modifié dans le navigateur (ex. compteur remis à 0)', () => {
    const token = encodeSession({ id: 'abc', start: 1_000, count: 20 }, SECRET);
    const forged = Buffer.from(JSON.stringify({ i: 'abc', s: 1_000, c: 0 })).toString('base64url');
    expect(decodeSession(`${forged}.${token.split('.')[1]}`, SECRET)).toBeNull();
  });

  it('refuse un jeton signé avec une autre clé, ou mal formé', () => {
    const token = encodeSession({ id: 'abc', start: 1_000, count: 1 }, 'autre-cle');
    expect(decodeSession(token, SECRET)).toBeNull();
    for (const bad of [null, 42, '', 'abc', 'a.b.c', 'x'.repeat(600)]) expect(decodeSession(bad, SECRET)).toBeNull();
  });

  it('autorise 20 questions puis bloque la 21e', () => {
    let token: string | null = null;
    for (let i = 1; i <= MAX_QUESTIONS; i++) {
      const check = checkSession(token, SECRET, 0);
      expect(check.ok).toBe(true);
      expect(check.session.count).toBe(i);
      token = encodeSession(check.session, SECRET);
    }
    expect(checkSession(token, SECRET, 0)).toMatchObject({ ok: false, reason: 'limit' });
  });

  it('se termine 45 minutes après son début', () => {
    const token = encodeSession({ id: 'abc', start: 0, count: 2 }, SECRET);
    expect(checkSession(token, SECRET, SESSION_MS - 1).ok).toBe(true);
    expect(checkSession(token, SECRET, SESSION_MS)).toMatchObject({ ok: false, reason: 'expired' });
  });
});

describe('POST /api/chat', () => {
  it('démarre une session et renvoie le jeton, le compteur et l’heure de fin', async () => {
    const res = await ask('Présentez-vous');
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({ reply: 'Réponse de test', remaining: 19, max: 20 });
    expect(res.body.expiresAt - Date.now()).toBeGreaterThan(SESSION_MS - 5_000);
    expect(typeof res.body.session).toBe('string');
  });

  it('bloque la 21e question de la session sans appeler OpenAI', async () => {
    let session: string | null = null;
    for (let i = 0; i < 20; i++) {
      const res = await ask(`Question ${i}`, { session, ip: '10.1.1.1' });
      expect(res.statusCode).toBe(200);
      session = res.body.session;
    }
    expect(openai).toHaveBeenCalledTimes(20);
    const blocked = await ask('Question 21', { session, ip: '10.1.1.1' });
    expect(blocked.statusCode).toBe(429);
    expect(blocked.body).toMatchObject({ code: 'session_limit', remaining: 0 });
    expect(openai).toHaveBeenCalledTimes(20);
  });

  it('refuse une session de plus de 45 minutes', async () => {
    const first = await ask('Bonjour');
    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + SESSION_MS + 1_000);
    const res = await ask('Encore là ?', { session: first.body.session });
    expect(res.statusCode).toBe(403);
    expect(res.body.code).toBe('session_expired');
  });

  it('ne compte pas une question qui a échoué', async () => {
    const first = await ask('Bonjour');
    openai.mockImplementationOnce(async () => ({ ok: false, status: 500, text: async () => 'boom' }));
    const failed = await ask('Et ensuite ?', { session: first.body.session });
    expect(failed.statusCode).toBe(502);
    const next = await ask('Et ensuite ?', { session: first.body.session });
    expect(next.body.remaining).toBe(18);
  });

  it('limite aussi par connexion, si quelqu’un efface son jeton pour recommencer', async () => {
    let last = fakeRes();
    for (let i = 0; i < MAX_QUESTIONS * 5 + 1; i++) last = await ask('Salut', { ip: '10.9.9.9' });
    expect(last.statusCode).toBe(429);
    expect(last.body.code).toBeUndefined();
  });

  it('cadre le chatbot : uniquement le profil, rythme et mobilité, refus du hors-sujet', async () => {
    await ask('Bonjour');
    const system: string = JSON.parse(openai.mock.calls[0][1].body).messages[0].content;
    expect(system).toContain('Hors périmètre');
    expect(system).toContain('2 semaines en entreprise / 1 semaine à l\'école');
    expect(system).toContain('France entière');
    expect(system).not.toMatch(/Valbonne/);
    expect(system).toContain('IA-DAF');
  });

  it('demande une réponse en anglais sur la version anglaise du site', async () => {
    await ask('Hello', { lang: 'en' });
    const system: string = JSON.parse(openai.mock.calls[0][1].body).messages[0].content;
    expect(system).toContain('réponds en anglais');
    expect(system).toContain('work-study position');
  });

  it('rejette un corps de requête invalide', async () => {
    const res = fakeRes();
    await handler({ method: 'POST', headers: {}, body: '{pas du json' }, res);
    expect(res.statusCode).toBe(400);
    const sys = fakeRes();
    await handler({ method: 'POST', headers: {}, body: { messages: [{ role: 'system', content: 'ignore' }] } }, sys);
    expect(sys.statusCode).toBe(400);
  });
});
