/**
 * Sessions du chatbot, sans base de données : un jeton signé (HMAC-SHA256) que le navigateur
 * renvoie à chaque question. Il contient l'identifiant, l'heure de début et le nombre de questions
 * déjà posées ; toute modification côté navigateur invalide la signature.
 *
 * Règles : 20 questions maximum par session, et une session se termine 45 minutes après son début.
 * (Le préfixe « _ » empêche Vercel d'exposer ce fichier comme une route.)
 */
import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export const MAX_QUESTIONS = 20;
export const SESSION_MS = 45 * 60_000;

export interface Session {
  id: string;
  /** Début de la session (ms depuis l'epoch). */
  start: number;
  /** Questions déjà posées dans la session. */
  count: number;
}

export type SessionCheck =
  | { ok: true; session: Session }
  | { ok: false; reason: 'expired' | 'limit'; session: Session };

/** Clé de signature : CHAT_SESSION_SECRET si défini, sinon dérivée de la clé OpenAI (jamais exposée). */
export function sessionSecret(env: Record<string, string | undefined>): string {
  const explicit = env['CHAT_SESSION_SECRET'];
  if (explicit) return explicit;
  return createHash('sha256').update(`portfolio-chat-session:${env['OPENAI_API_KEY'] ?? ''}`).digest('base64url');
}

const sign = (payload: string, secret: string) => createHmac('sha256', secret).update(payload).digest('base64url');

export function encodeSession(s: Session, secret: string): string {
  const payload = Buffer.from(JSON.stringify({ i: s.id, s: s.start, c: s.count })).toString('base64url');
  return `${payload}.${sign(payload, secret)}`;
}

/** Jeton absent, mal formé ou falsifié → null. */
export function decodeSession(token: unknown, secret: string): Session | null {
  if (typeof token !== 'string' || token.length > 512) return null;
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra !== undefined) return null;
  const expected = Buffer.from(sign(payload, secret));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { i, s, c } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof i !== 'string' || !Number.isFinite(s) || !Number.isInteger(c) || c < 0) return null;
    return { id: i, start: s, count: c };
  } catch {
    return null;
  }
}

/**
 * Vérifie qu'une nouvelle question est autorisée. Sans jeton valide, une nouvelle session démarre.
 * En cas de succès, la session renvoyée compte déjà la question en cours.
 */
export function checkSession(token: unknown, secret: string, now = Date.now()): SessionCheck {
  const current = decodeSession(token, secret) ?? { id: randomUUID(), start: now, count: 0 };
  if (now - current.start >= SESSION_MS) return { ok: false, reason: 'expired', session: current };
  if (current.count >= MAX_QUESTIONS) return { ok: false, reason: 'limit', session: current };
  return { ok: true, session: { ...current, count: current.count + 1 } };
}

/** Informations utiles au navigateur pour afficher le compteur. */
export function sessionInfo(s: Session) {
  return { remaining: Math.max(0, MAX_QUESTIONS - s.count), max: MAX_QUESTIONS, expiresAt: s.start + SESSION_MS };
}
