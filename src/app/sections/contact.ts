import { AfterViewInit, Component, inject, output } from '@angular/core';
import { I18n } from '../i18n';
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
            [eyebrow]="t.contact.eyebrow"
            [title]="t.contact.title"
            [highlight]="t.contact.highlight"
            [subtitle]="t.contact.subtitle"
          />
          <div class="actions">
            @if (p.links.email) {
              <a class="btn btn-primary" [href]="'mailto:' + p.links.email">✉️ {{ p.links.email }}</a>
            }
            @if (p.links.schoolEmail) {
              <a class="btn" [href]="'mailto:' + p.links.schoolEmail">🎓 {{ p.links.schoolEmail }}</a>
            }
            @if (p.links.phone) {
              <a class="btn" [href]="'tel:' + p.links.phone.replaceAll(' ', '')">📞 {{ p.links.phone }}</a>
            }
            @if (p.links.cv) {
              <a class="btn" [href]="p.links.cv" download>{{ t.contact.cv }}</a>
            }
            @if (p.links.linkedin) {
              <a class="btn" [href]="p.links.linkedin" target="_blank" rel="noopener">LinkedIn ↗</a>
            }
            <a class="btn" [href]="p.links.github" target="_blank" rel="noopener">GitHub ↗</a>
            <button class="btn" type="button" (click)="askAssistant.emit()">{{ t.contact.ask }}</button>
          </div>
        </div>
      </div>
    </section>
    <footer class="container">
      <span>© {{ year }} {{ p.firstName }} {{ p.lastName }}</span>
      <span>{{ t.contact.footer }}</span>
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
export class Contact implements AfterViewInit {
  readonly askAssistant = output<void>();
  private readonly i18n = inject(I18n);
  protected get p() {
    return this.i18n.profile();
  }
  protected get t() {
    return this.i18n.t();
  }
  protected readonly year = new Date().getFullYear();

  /** Les sections sont chargées en différé : un lien direct (#projets…) défile une fois qu'elles existent. */
  ngAfterViewInit(): void {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }
}
