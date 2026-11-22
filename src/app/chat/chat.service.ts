import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

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
        this.http.post<{ reply: string }>('/api/chat', { messages: this.messages().slice(-MAX_HISTORY) }),
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
      if (e.status === 429) return 'Beaucoup de questions en peu de temps : réessayez dans une minute.';
      if (e.status === 503) return "L'assistant n'est pas encore configuré. Revenez bientôt !";
      if (e.error?.error) return String(e.error.error);
    }
    return "L'assistant est momentanément indisponible. Réessayez plus tard.";
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
