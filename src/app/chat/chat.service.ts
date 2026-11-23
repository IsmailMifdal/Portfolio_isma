import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { I18n } from '../i18n';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Historique envoyé au serveur : les derniers échanges suffisent au contexte. */
const MAX_HISTORY = 12;
const STORAGE_KEY = 'portfolio-chat';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly i18n = inject(I18n);

  readonly messages = signal<ChatMessage[]>(this.restore());
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async send(text: string): Promise<void> {
    const content = text.trim();
    if (!content || this.loading()) return;
    this.error.set(null);
    this.messages.update((m) => [...m, { role: 'user', content }]);
    this.loading.set(true);
    try {
      // La clé OpenAI reste sur le serveur : le navigateur ne parle qu'à /api/chat.
      const res = await firstValueFrom(
        this.http.post<{ reply: string }>('/api/chat', {
          messages: this.messages().slice(-MAX_HISTORY),
          lang: this.i18n.lang(),
        }),
      );
      this.messages.update((m) => [...m, { role: 'assistant', content: res.reply }]);
    } catch (e) {
      this.error.set(this.describe(e));
    } finally {
      this.loading.set(false);
      this.persist();
    }
  }

  reset(): void {
    this.messages.set([]);
    this.error.set(null);
    this.persist();
  }

  private describe(e: unknown): string {
    if (e instanceof HttpErrorResponse) {
      const errors = this.i18n.t().chat.errors;
      if (e.status === 429) return errors.rate;
      if (e.status === 503) return errors.setup;
      if (e.error?.error && this.i18n.lang() === 'fr') return String(e.error.error);
    }
    return this.i18n.t().chat.errors.generic;
  }

  private restore(): ChatMessage[] {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages()));
    } catch {
      /* stockage indisponible : la conversation vit le temps de la page */
    }
  }
}
