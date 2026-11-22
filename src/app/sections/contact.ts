import { Component, output } from '@angular/core';
import { PROFILE } from '../data/profile';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeader } from '../shared/section-header';

@Component({
  selector: 'app-contact',
  imports: [SectionHeader, RevealDirective],
  template: `
    <section id="contact" class="section">
      <div class="container">
        <div class="card cta" appReveal>
          <app-section-header
            eyebrow="06 · Contact"
            title="Travaillons"
            highlight="ensemble"
            subtitle="Un poste, une alternance, un projet ? Écrivez-moi, ou interrogez d'abord mon assistant IA sur mon parcours."
          />
          <div class="actions">
            @if (p.links.email) {
              <a class="btn btn-primary" [href]="'mailto:' + p.links.email">✉️ {{ p.links.email }}</a>
            }
            @if (p.links.schoolEmail) {
              <a class="btn" [href]="'mailto:' + p.links.schoolEmail">🎓 {{ p.links.schoolEmail }}</a>
            }
            @if (p.links.linkedin) {
              <a class="btn" [href]="p.links.linkedin" target="_blank" rel="noopener">LinkedIn ↗</a>
            }
            <a class="btn" [href]="p.links.github" target="_blank" rel="noopener">GitHub ↗</a>
            <button class="btn" type="button" (click)="askAssistant.emit()">✨ Demander à mon assistant</button>
          </div>
        </div>
      </div>
    </section>
    <footer class="container">
      <span>© {{ year }} {{ p.firstName }} {{ p.lastName }}</span>
      <span>Construit avec Angular · Assistant propulsé par OpenAI</span>
    </footer>
  `,
  styles: `
    .cta {
      padding: 48px;
      background:
        radial-gradient(circle at 0% 0%, rgba(124, 92, 255, 0.18), transparent 50%),
        radial-gradient(circle at 100% 100%, rgba(34, 211, 238, 0.14), transparent 50%), var(--surface);
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    footer {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      padding: 28px 0 40px;
      color: var(--muted);
      font-size: 14px;
      border-top: 1px solid var(--border);
    }
    @media (max-width: 600px) {
      .cta {
        padding: 28px 20px;
      }
    }
  `,
})
export class Contact {
  readonly askAssistant = output<void>();
  protected readonly p = PROFILE;
  protected readonly year = new Date().getFullYear();
}
