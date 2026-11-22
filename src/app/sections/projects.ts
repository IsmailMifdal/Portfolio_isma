import { Component, signal } from '@angular/core';
import { PROFILE } from '../data/profile';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeader } from '../shared/section-header';

@Component({
  selector: 'app-projects',
  imports: [SectionHeader, RevealDirective],
  template: `
    <section id="projets" class="section">
      <div class="container">
        <app-section-header
          eyebrow="05 · Projets"
          title="Projets"
          highlight="réalisés"
          subtitle="Une sélection de projets publiés sur GitHub, du produit complet au prototype, avec leur démo en ligne."
        />

        @if (p.projects.length) {
          <div class="grid">
            @for (pr of p.projects; track pr.name) {
              <article class="card project" [class.featured]="pr.featured" appReveal>
                @if (pr.image && !broken().has(pr.name)) {
                  <img [src]="pr.image" [alt]="'Aperçu de ' + pr.name" loading="lazy" (error)="markBroken(pr.name)" />
                } @else {
                  <div class="banner" [style.--hue]="hue($index)" aria-hidden="true">
                    <span class="emoji">{{ pr.emoji ?? '🚀' }}</span>
                    @if (pr.featured) {
                      <span class="tag">⭐ Projet phare</span>
                    }
                  </div>
                }
                <div class="body">
                  <div class="title">
                    <h3>{{ pr.name }}</h3>
                    @if (pr.year) {
                      <span class="year">{{ pr.year }}</span>
                    }
                  </div>
                  <p class="tagline">{{ pr.tagline }}</p>
                  <p>{{ pr.description }}</p>
                  @if (pr.highlights?.length) {
                    <ul>
                      @for (h of pr.highlights; track $index) {
                        <li>{{ h }}</li>
                      }
                    </ul>
                  }
                  <div class="stack">
                    @for (s of pr.stack; track s) {
                      <span class="chip">{{ s }}</span>
                    }
                  </div>
                  <div class="links">
                    @if (pr.repo) {
                      <a class="btn" [href]="pr.repo" target="_blank" rel="noopener">Code ↗</a>
                    }
                    @if (pr.demo) {
                      <a class="btn btn-primary" [href]="pr.demo" target="_blank" rel="noopener">Démo en ligne ↗</a>
                    }
                  </div>
                </div>
              </article>
            }
          </div>
        } @else {
          <div class="card empty" appReveal>
            <span class="icon">🚧</span>
            <div>
              <h3>Projets en cours de sélection</h3>
              <p>
                Cette section se remplit depuis <code>src/app/data/profile.ts</code> (tableau <code>projects</code>).
                En attendant, tous mes dépôts sont sur GitHub.
              </p>
              <a class="btn btn-primary" [href]="p.links.github" target="_blank" rel="noopener">Voir mon GitHub ↗</a>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 22px;
    }
    .project {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .project:hover {
      transform: translateY(-4px);
    }
    .featured {
      grid-column: 1 / -1;
      flex-direction: row;
    }
    .featured .banner {
      flex: 0 0 38%;
      height: auto;
      min-height: 260px;
      border-bottom: 0;
      border-right: 1px solid var(--border);
    }
    .banner {
      position: relative;
      height: 140px;
      display: grid;
      place-items: center;
      border-bottom: 1px solid var(--border);
      background:
        radial-gradient(circle at 20% 20%, hsl(var(--hue) 90% 65% / 0.55), transparent 55%),
        radial-gradient(circle at 85% 80%, hsl(calc(var(--hue) + 60) 90% 60% / 0.45), transparent 55%),
        var(--bg-soft);
    }
    .emoji {
      font-size: 56px;
      filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.35));
      transition: transform 0.3s ease;
    }
    .project:hover .emoji {
      transform: scale(1.12) rotate(-4deg);
    }
    .tag {
      position: absolute;
      top: 14px;
      left: 14px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.35);
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      backdrop-filter: blur(6px);
    }
    .title {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 10px;
    }
    .year {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--muted);
    }
    img {
      width: 100%;
      aspect-ratio: 16 / 9;
      object-fit: cover;
      border-bottom: 1px solid var(--border);
    }
    .body {
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }
    h3 {
      font-size: 22px;
    }
    .tagline {
      color: var(--accent);
      font-weight: 500;
      margin: 0;
    }
    p {
      margin: 0;
      color: var(--muted);
    }
    ul {
      margin: 0;
      padding-left: 18px;
      color: var(--muted);
    }
    .stack {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: auto;
      padding-top: 8px;
    }
    .links {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .links .btn {
      padding: 9px 16px;
      font-size: 14px;
    }
    .empty {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      padding: 32px;
    }
    .empty .icon {
      font-size: 40px;
    }
    .empty h3 {
      margin-bottom: 8px;
    }
    .empty p {
      margin-bottom: 18px;
    }
    code {
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--text);
    }
    @media (max-width: 760px) {
      .featured {
        flex-direction: column;
      }
      .featured .banner {
        min-height: 160px;
        border-right: 0;
        border-bottom: 1px solid var(--border);
      }
      .empty {
        flex-direction: column;
      }
    }
  `,
})
export class Projects {
  protected readonly p = PROFILE;
  protected readonly broken = signal(new Set<string>());
  /** Teinte de bannière différente pour chaque projet. */
  protected hue(index: number): number {
    return [258, 190, 330, 40, 150][index % 5];
  }

  protected markBroken(name: string): void {
    this.broken.update((s) => new Set(s).add(name));
  }
}
