import { Component, HostListener, signal } from '@angular/core';
import { PROFILE } from '../data/profile';

@Component({
  selector: 'app-navbar',
  template: `
    <nav [class.scrolled]="scrolled()" aria-label="Navigation principale">
      <div class="container bar">
        <a class="brand" href="#accueil" (click)="open.set(false)">
          <span class="logo">IM</span>
          <span class="name">{{ p.firstName }} {{ p.lastName }}</span>
        </a>
        <button
          class="burger"
          type="button"
          [attr.aria-expanded]="open()"
          aria-controls="menu"
          (click)="open.set(!open())"
        >
          <span></span><span></span><span></span>
          <span class="sr">Menu</span>
        </button>
        <ul id="menu" [class.open]="open()">
          @for (l of links; track l.href) {
            <li><a [href]="l.href" (click)="open.set(false)">{{ l.label }}</a></li>
          }
          <li>
            <button class="theme" type="button" (click)="toggleTheme()" [attr.aria-label]="'Basculer le thème'">
              {{ theme() === 'light' ? '🌙' : '☀️' }}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: `
    nav {
      position: fixed;
      inset: 0 0 auto 0;
      z-index: 50;
      transition: background 0.3s ease, border-color 0.3s ease;
      border-bottom: 1px solid transparent;
    }
    nav.scrolled {
      background: color-mix(in srgb, var(--bg) 78%, transparent);
      backdrop-filter: blur(14px);
      border-color: var(--border);
    }
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      font-family: var(--font-display);
      font-weight: 600;
    }
    .logo {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--gradient);
      color: #fff;
      font-size: 14px;
    }
    ul {
      display: flex;
      align-items: center;
      gap: 4px;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    ul a {
      display: block;
      padding: 8px 12px;
      border-radius: 10px;
      text-decoration: none;
      color: var(--muted);
      font-size: 15px;
      transition: color 0.2s, background 0.2s;
    }
    ul a:hover {
      color: var(--text);
      background: var(--surface);
    }
    .theme {
      border: 1px solid var(--border);
      background: var(--surface);
      border-radius: 10px;
      padding: 6px 10px;
      cursor: pointer;
      font-size: 16px;
    }
    .burger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: 0;
      padding: 8px;
      cursor: pointer;
    }
    .burger span:not(.sr) {
      width: 22px;
      height: 2px;
      background: var(--text);
      border-radius: 2px;
    }
    .sr {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }
    @media (max-width: 860px) {
      .burger {
        display: flex;
      }
      ul {
        position: absolute;
        top: 72px;
        left: 16px;
        right: 16px;
        flex-direction: column;
        align-items: stretch;
        padding: 12px;
        border-radius: var(--radius);
        background: var(--bg-soft);
        border: 1px solid var(--border);
        box-shadow: var(--shadow);
        display: none;
      }
      ul.open {
        display: flex;
      }
      .name {
        display: none;
      }
    }
  `,
})
export class Navbar {
  protected readonly p = PROFILE;
  protected readonly open = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly theme = signal<'dark' | 'light'>(this.initialTheme());
  protected readonly links = [
    { href: '#apropos', label: 'À propos' },
    { href: '#competences', label: 'Compétences' },
    { href: '#experience', label: 'Expériences' },
    { href: '#formation', label: 'Formation' },
    { href: '#projets', label: 'Projets' },
    { href: '#contact', label: 'Contact' },
  ];

  constructor() {
    document.documentElement.dataset['theme'] = this.theme();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  protected toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.dataset['theme'] = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* stockage indisponible : le choix vaut pour la session */
    }
  }

  private initialTheme(): 'dark' | 'light' {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      /* ignore */
    }
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
}
