import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18n } from '../i18n';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat-widget',
  imports: [FormsModule],
  template: `
    @if (open()) {
      <section class="panel" role="dialog" [attr.aria-label]="t.chat.dialog" aria-modal="false">
        <header>
          <div class="who">
            <span class="avatar">✨</span>
            <div>
              <strong>Discuter avec {{ p.firstName }}</strong>
              <small><span class="dot"></span>{{ t.chat.subtitle }}</small>
            </div>
          </div>
          <div class="tools">
            @if (chat.messages().length) {
              <button type="button" (click)="chat.reset()" [title]="t.chat.reset" [attr.aria-label]="t.chat.reset">↺</button>
            }
            <button type="button" (click)="close()" [attr.aria-label]="t.chat.close">✕</button>
          </div>
        </header>

        <div class="messages" #scroller aria-live="polite">
          <div class="msg assistant">{{ t.chat.welcome(p.firstName) }}</div>
          @for (m of chat.messages(); track $index) {
            <div class="msg" [class.user]="m.role === 'user'" [class.assistant]="m.role === 'assistant'">{{ m.content }}</div>
          }
          @if (chat.loading()) {
            <div class="msg assistant typing" [attr.aria-label]="t.chat.typing"><span></span><span></span><span></span></div>
          }
          @if (chat.error(); as err) {
            <div class="error" role="alert">{{ err }}</div>
          }
          @if (!chat.messages().length) {
            <div class="suggestions">
              @for (s of t.chat.suggestions; track s) {
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
            [placeholder]="t.chat.placeholder"
            maxlength="600"
            autocomplete="off"
            [attr.aria-label]="t.chat.question"
          />
          <button type="submit" [disabled]="!draft().trim() || chat.loading()" [attr.aria-label]="t.chat.send">➤</button>
        </form>
        <p class="disclaimer">{{ t.chat.disclaimer }}</p>
      </section>
    }

    <button class="fab" type="button" (click)="toggle()" [attr.aria-expanded]="open()" [attr.aria-label]="open() ? t.chat.close : t.chat.open">
      @if (open()) {
        ✕
      } @else {
        <span class="spark">✨</span><span class="label">{{ t.chat.fab }}</span>
      }
    </button>
  `,
  styleUrl: './chat-widget.scss',
})
export class ChatWidget {
  protected readonly chat = inject(ChatService);
  private readonly i18n = inject(I18n);
  protected get p() {
    return this.i18n.profile();
  }
  protected get t() {
    return this.i18n.t();
  }
  protected readonly open = signal(false);
  protected readonly draft = signal('');
  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly field = viewChild<ElementRef<HTMLInputElement>>('field');

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
