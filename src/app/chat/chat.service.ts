import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { I18n } from '../i18n';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatReply {
  reply: string;
  session: string;
  remaining: number;
  max: number;
  expiresAt: number;
}

interface Stored {
  messages: ChatMessage[];
  token: string | null;
  remaining: number | null;
  expiresAt: number | null;
}

/** Historique envoyé au serveur : les derniers échanges suffisent au contexte. */
const MAX_HISTORY = 12;
const STORAGE_KEY = 'portfolio-chat-session';

/**
 * Conversation avec l'assistant. Le serveur fixe les règles (20 questions, 45 minutes par session)
 * via un jeton signé ; le navigateur le conserve pour la durée de la session, même si l'onglet est fermé.
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly i18n = inject(I18n);
  private token: string | null = null;
  private endTimer?: ReturnType<typeof setTimeout>;

  readonly messages = signal<ChatMessage[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  /** Information non bloquante (ex. : la session précédente est terminée). */
  readonly notice = signal<string | null>(null);
  /** Questions restantes dans la session (null tant qu'aucune question n'a été posée). */
  readonly remaining = signal<number | null>(null);
  /** Fin de la session en cours (ms depuis l'epoch). */
  readonly expiresAt = signal<number | null>(null);
  /** Les 20 questions sont utilisées : l'assistant attend la fin de la session. */
  readonly limitReached = signal(false);

  constructor() {
    this.restore();
  }

  async send(text: string): Promise<void> {
    const content = text.trim();
    if (!content || this.loading() || this.limitReached()) return;
    this.endIfExpired();
    this.error.set(null);
    this.messages.update((m) => [...m, { role: 'user', content }]);
    this.loading.set(true);
    let retry = false;
    try {
      // La clé OpenAI reste sur le serveur : le navigateur ne parle qu'à /api/chat.
      const res = await firstValueFrom(
        this.http.post<ChatReply>('/api/chat', {
          messages: this.messages().slice(-MAX_HISTORY),
          lang: this.i18n.lang(),
          session: this.token,
        }),
      );
      this.token = res.session;
      this.remaining.set(res.remaining);
      this.expiresAt.set(res.expiresAt);
      this.messages.update((m) => [...m, { role: 'assistant', content: res.reply }]);
      if (res.remaining <= 0) this.reachLimit(res.expiresAt);
    } catch (e) {
      retry = this.handleError(e, content);
    } finally {
      this.loading.set(false);
      this.persist();
    }
    if (retry) await this.send(content);
  }

  /** Efface la conversation affichée ; la session (compteur et durée) continue. */
  reset(): void {
    this.messages.set([]);
    this.error.set(null);
    this.notice.set(null);
    this.persist();
  }

  /** Heure de fin de session, au format local. */
  endTime(): string {
    const at = this.expiresAt();
    return at ? new Date(at).toLocaleTimeString(this.i18n.lang(), { hour: '2-digit', minute: '2-digit' }) : '';
  }

  /** Affiche l'erreur ; renvoie true si la question doit être reposée dans une nouvelle session. */
  private handleError(e: unknown, question: string): boolean {
    const errors = this.i18n.t().chat.errors;
    if (e instanceof HttpErrorResponse) {
      const code = e.error?.code;
      if (code === 'session_limit') {
        this.dropLastQuestion(question);
        this.remaining.set(0);
        this.reachLimit(e.error.expiresAt);
        return false;
      }
      if (code === 'session_expired') {
        // La session a expiré côté serveur : on repart de zéro et on repose la question.
        this.endSession();
        return true;
      }
      if (e.status === 429) this.error.set(errors.rate);
      else if (e.status === 503) this.error.set(errors.setup);
      else if (e.error?.error && this.i18n.lang() === 'fr') this.error.set(String(e.error.error));
      else this.error.set(errors.generic);
      return false;
    }
    this.error.set(errors.generic);
    return false;
  }

  private dropLastQuestion(question: string): void {
    this.messages.update((m) => (m.at(-1)?.role === 'user' && m.at(-1)?.content === question ? m.slice(0, -1) : m));
  }

  private reachLimit(expiresAt: number): void {
    this.expiresAt.set(expiresAt);
    this.limitReached.set(true);
    this.scheduleEnd();
  }

  /** Termine la session : conversation effacée, une nouvelle session démarrera à la prochaine question. */
  private endSession(): void {
    clearTimeout(this.endTimer);
    const hadSession = this.token !== null || this.messages().length > 0;
    this.token = null;
    this.messages.set([]);
    this.remaining.set(null);
    this.expiresAt.set(null);
    this.limitReached.set(false);
    this.error.set(null);
    this.notice.set(hadSession ? this.i18n.t().chat.session.expired : null);
    this.persist();
  }

  private endIfExpired(): void {
    const at = this.expiresAt();
    if (at !== null && Date.now() >= at) this.endSession();
  }

  private scheduleEnd(): void {
    clearTimeout(this.endTimer);
    const at = this.expiresAt();
    if (at === null) return;
    this.endTimer = setTimeout(() => this.endSession(), Math.max(0, at - Date.now()));
  }

  private restore(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as Stored;
      if (!s.expiresAt || Date.now() >= s.expiresAt) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      this.token = s.token;
      this.messages.set(Array.isArray(s.messages) ? s.messages : []);
      this.remaining.set(s.remaining);
      this.expiresAt.set(s.expiresAt);
      if (s.remaining === 0) this.limitReached.set(true);
      this.scheduleEnd();
    } catch {
      /* stockage indisponible ou illisible : nouvelle session */
    }
  }

  private persist(): void {
    try {
      const data: Stored = {
        messages: this.messages(),
        token: this.token,
        remaining: this.remaining(),
        expiresAt: this.expiresAt(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* stockage indisponible : la conversation vit le temps de la page */
    }
  }
}
