import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PROFILE } from '../data/profile';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat-widget',
  imports: [FormsModule],
  template: `
    @if (open()) {
      <section class="panel" role="dialog" aria-label="Assistant IA" aria-modal="false">
        <header>
          <div class="who">
            <span class="avatar">✨</span>
            <div>
              <strong>Discuter avec {{ p.firstName }}</strong>
              <small><span class="dot"></span>Mon parcours, mes compétences, mes projets</small>
            </div>
          </div>
          <div class="tools">
            @if (chat.messages().length) {
              <button type="button" (click)="chat.reset()" title="Nouvelle conversation">↺</button>
            }
            <button type="button" (click)="close()" aria-label="Fermer l'assistant">✕</button>
          </div>
        </header>

        <div class="messages" #scroller aria-live="polite">
          <div class="msg assistant">{{ welcome }}</div>
          @for (m of chat.messages(); track $index) {
            <div class="msg" [class.user]="m.role === 'user'" [class.assistant]="m.role === 'assistant'">{{ m.content }}</div>
          }
          @if (chat.loading()) {
            <div class="msg assistant typing" aria-label="L'assistant écrit"><span></span><span></span><span></span></div>
          }
          @if (chat.error(); as err) {
            <div class="error" role="alert">{{ err }}</div>
          }
          @if (!chat.messages().length) {
            <div class="suggestions">
              @for (s of suggestions; track s) {
                <button type="button" (click)="ask(s)">{{ s }}</button>
              }
            </div>
          }
        </div>

        <form (ngSubmit)="submit()">
          <input
            #field
            name="question"
            [(ngModel)]="draft"
            placeholder="Votre question…"
            maxlength="600"
            autocomplete="off"
            aria-label="Votre question"
          />
          <button type="submit" [disabled]="!draft().trim() || chat.loading()" aria-label="Envoyer">➤</button>
        </form>
        <p class="disclaimer">Réponses générées par IA, en mon nom, à partir de mon parcours réel.</p>
      </section>
    }

    <button class="fab" type="button" (click)="toggle()" [attr.aria-expanded]="open()" aria-label="Ouvrir l'assistant IA">
      @if (open()) {
        ✕
      } @else {
        <span class="spark">✨</span><span class="label">Demandez-moi</span>
      }
    </button>
  `,
  styleUrl: './chat-widget.scss',
})
export class ChatWidget {
  protected readonly chat = inject(ChatService);
  protected readonly p = PROFILE;
  protected readonly open = signal(false);
  protected readonly draft = signal('');
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

  protected readonly welcome =
    `Bonjour 👋 Moi c'est ${PROFILE.firstName}. Merci de passer sur mon portfolio ! ` +
    "Posez-moi vos questions sur mon parcours, mes expériences ou ce que je sais faire : je vous réponds avec plaisir.";

  protected readonly suggestions = [
    'Pouvez-vous vous présenter ?',
    'Quelle expérience avez-vous en Java / Angular ?',
    "Comment intégrez-vous l'IA dans vos projets ?",
    'Quel type d’alternance recherchez-vous ?',
    'Pourquoi devrais-je vous recruter ?',
  ];

  constructor() {
    // Défile vers le dernier message à chaque nouvel échange
    effect(() => {
      this.chat.messages();
      this.chat.loading();
      queueMicrotask(() => {
        const el = this.scroller()?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      });
    });
  }

  /** Ouvre le panneau (bouton « Poser une question » de l'en-tête et du contact). */
  openPanel(): void {
    this.open.set(true);
    queueMicrotask(() => this.field()?.nativeElement.focus());
  }

  protected toggle(): void {
    if (this.open()) this.close();
    else this.openPanel();
  }

  protected close(): void {
    this.open.set(false);
  }

  protected ask(question: string): void {
    void this.chat.send(question);
  }

  protected submit(): void {
    const text = this.draft();
    this.draft.set('');
    void this.chat.send(text);
  }
}
