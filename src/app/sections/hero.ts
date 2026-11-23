import { Component, OnDestroy, OnInit, inject, output, signal } from '@angular/core';
import { I18n } from '../i18n';

@Component({
  selector: 'app-hero',
  template: `
    <section id="accueil" class="hero">
      <div class="glow g1"></div>
      <div class="glow g2"></div>
      <div class="container grid">
        <div class="intro">
          <span class="status"><span class="dot"></span>{{ p.badge }}</span>
          <h1>
            {{ t.hero.hello }}<br />
            <span class="gradient-text">{{ p.firstName }} {{ p.lastName }}</span>
          </h1>
          <p class="role">
            <span class="mono">&gt;</span> {{ typed() }}<span class="caret">|</span>
          </p>
          <p class="pitch">{{ p.pitch }}</p>
          <div class="actions">
            <a class="btn btn-primary" href="#projets">{{ t.hero.seeProjects }}</a>
            <button class="btn" type="button" (click)="askAssistant.emit()">
              {{ t.hero.ask }}
            </button>
          </div>
          <div class="socials">
            <a [href]="p.links.github" target="_blank" rel="noopener" aria-label="GitHub">GitHub ↗</a>
            @if (p.links.linkedin) {
              <a [href]="p.links.linkedin" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn ↗</a>
            }
            @if (p.links.cv) {
              <a [href]="p.links.cv" download>{{ t.hero.cv }}</a>
            }
          </div>
        </div>
        <div class="portrait">
          <div class="ring">
            @if (!photoFailed()) {
              <picture>
                <source type="image/webp" srcset="profile-360.webp 360w, profile-720.webp 720w" sizes="(max-width: 860px) 240px, 340px" />
                <img
                  [src]="p.photo"
                  [alt]="t.hero.photoOf + ' ' + p.firstName + ' ' + p.lastName"
                  width="720"
                  height="720"
                  fetchpriority="high"
                  decoding="async"
                  (error)="photoFailed.set(true)"
                />
              </picture>
            } @else {
              <div class="initials" aria-hidden="true">{{ p.firstName[0] }}{{ p.lastName[0] }}</div>
            }
          </div>
          <div class="badge b1">{{ t.hero.badges[0] }}</div>
          <div class="badge b2">{{ t.hero.badges[1] }}</div>
          <div class="badge b3">{{ t.hero.badges[2] }}</div>
        </div>
      </div>
      <a class="scroll" href="#apropos" [attr.aria-label]="t.hero.scrollDown">↓</a>
    </section>
  `,
  styles: `
    .hero {
      position: relative;
      min-height: 100svh;
      display: flex;
      align-items: center;
      padding: 110px 0 80px;
      overflow: hidden;
    }
    .glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.45;
      pointer-events: none;
      animation: float 14s ease-in-out infinite;
    }
    .g1 {
      width: 480px;
      height: 480px;
      background: var(--primary);
      top: -120px;
      left: -140px;
    }
    .g2 {
      width: 420px;
      height: 420px;
      background: var(--accent);
      bottom: -160px;
      right: -120px;
      animation-delay: -7s;
    }
:host-context([data-theme='light']) .glow {
      opacity: 0.22;
    }
    @keyframes float {
      50% {
        transform: translate(40px, 30px) scale(1.08);
      }
    }
    .grid {
      position: relative;
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 48px;
      align-items: center;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      font-size: 13px;
      color: var(--muted);
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.2);
    }
    h1 {
      font-size: clamp(40px, 6.5vw, 72px);
      margin: 22px 0 14px;
      letter-spacing: -0.02em;
    }
    .role {
      font-family: var(--font-mono);
      font-size: clamp(16px, 2.2vw, 20px);
      color: var(--accent);
      margin: 0 0 18px;
      min-height: 1.6em;
    }
    .mono {
      color: var(--muted);
    }
    .caret {
      animation: blink 1s steps(1) infinite;
    }
    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
    .pitch {
      color: var(--muted);
      font-size: 18px;
      max-width: 560px;
      margin: 0 0 30px;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .socials {
      display: flex;
      gap: 20px;
      margin-top: 28px;
      font-size: 15px;
    }
    .socials a {
      color: var(--muted);
      text-decoration: none;
    }
    .socials a:hover {
      color: var(--text);
    }
    .portrait {
      position: relative;
      justify-self: center;
    }
    .ring {
      width: clamp(240px, 30vw, 340px);
      aspect-ratio: 1;
      border-radius: 50%;
      padding: 5px;
      background: var(--gradient);
      box-shadow: 0 30px 80px -20px rgba(124, 92, 255, 0.55);
    }
    .ring picture {
      display: block;
      width: 100%;
      height: 100%;
    }
    .ring img,
    .initials {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      background: var(--bg-soft);
    }
    .initials {
      display: grid;
      place-items: center;
      font: 700 clamp(64px, 9vw, 104px) var(--font-display);
      color: var(--text);
    }
    .badge {
      position: absolute;
      padding: 8px 14px;
      border-radius: 14px;
      background: color-mix(in srgb, var(--bg-soft) 85%, transparent);
      border: 1px solid var(--border);
      backdrop-filter: blur(10px);
      font-size: 14px;
      font-weight: 600;
      box-shadow: var(--shadow);
      animation: bob 6s ease-in-out infinite;
    }
    .b1 {
      top: 8%;
      left: -18%;
    }
    .b2 {
      bottom: 14%;
      left: -10%;
      animation-delay: -2s;
    }
    .b3 {
      top: 46%;
      right: -16%;
      animation-delay: -4s;
    }
    @keyframes bob {
      50% {
        transform: translateY(-10px);
      }
    }
    .scroll {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      color: var(--muted);
      text-decoration: none;
      font-size: 22px;
      animation: bob 2.4s ease-in-out infinite;
    }
    @media (max-width: 520px) {
      .badge {
        font-size: 12px;
        padding: 6px 10px;
      }
      .b1 {
        top: 0;
        left: -12%;
      }
      .b2 {
        bottom: 2%;
        left: -8%;
      }
      .b3 {
        top: auto;
        bottom: 18%;
        right: -14%;
      }
    }
    @media (max-width: 860px) {
      .grid {
        grid-template-columns: 1fr;
        text-align: left;
      }
      .portrait {
        order: -1;
      }
      .b1 {
        left: -6%;
      }
      .b3 {
        right: -6%;
      }
      .b2 {
        left: 0;
      }
    }
  `,
})
export class Hero implements OnInit, OnDestroy {
  readonly askAssistant = output<void>();
  private readonly i18n = inject(I18n);
  protected get p() {
    return this.i18n.profile();
  }
  protected get t() {
    return this.i18n.t();
  }
  protected readonly typed = signal('');
  protected readonly photoFailed = signal(false);
  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      this.typed.set(this.p.roles[0]);
      return;
    }
    this.type(0, 0, false);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  /** Effet machine à écrire : écrit, attend, efface, passe au rôle suivant. */
  private type(roleIndex: number, length: number, deleting: boolean): void {
    const role = this.p.roles[roleIndex];
    this.typed.set(role.slice(0, length));
    let next: () => void;
    let delay = deleting ? 35 : 70;
    if (!deleting && length === role.length) {
      delay = 1800;
      next = () => this.type(roleIndex, length, true);
    } else if (deleting && length === 0) {
      delay = 300;
      next = () => this.type((roleIndex + 1) % this.p.roles.length, 0, false);
    } else {
      next = () => this.type(roleIndex, length + (deleting ? -1 : 1), deleting);
    }
    this.timer = setTimeout(next, delay);
  }
}
