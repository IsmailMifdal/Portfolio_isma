import { Component } from '@angular/core';
import { PROFILE } from '../data/profile';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeader } from '../shared/section-header';

@Component({
  selector: 'app-about',
  imports: [SectionHeader, RevealDirective],
  template: `
    <section id="apropos" class="section">
      <div class="container">
        <app-section-header eyebrow="01 · À propos" title="Qui" highlight="suis-je ?" />
        <div class="grid">
          <div class="text" appReveal>
            @for (paragraph of p.about; track $index) {
              <p [class.todo]="isTodo(paragraph)">{{ paragraph }}</p>
            }
            <div class="langs">
              @for (l of p.languages; track l.name) {
                <span class="chip">🌍 {{ l.name }} · <span [class.todo]="isTodo(l.level)">{{ l.level }}</span></span>
              }
            </div>
          </div>
          <div class="stats">
            @for (s of p.stats; track s.label) {
              <div class="card stat" appReveal>
                <strong class="gradient-text" [class.todo]="isTodo(s.value)">{{ isTodo(s.value) ? '—' : s.value }}</strong>
                <span>{{ s.label }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 40px;
      align-items: start;
    }
    .text p {
      font-size: 18px;
      margin: 0 0 18px;
    }
    .langs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    .stats {
      display: grid;
      gap: 16px;
    }
    .stat {
      display: flex;
      align-items: baseline;
      gap: 14px;
    }
    .stat strong {
      font: 700 40px var(--font-display);
    }
    .stat span {
      color: var(--muted);
    }
    @media (max-width: 860px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class About {
  protected readonly p = PROFILE;
  protected isTodo(s: string): boolean {
    return s.includes('À compléter');
  }
}
