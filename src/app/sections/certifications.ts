import { Component, inject } from '@angular/core';
import { I18n } from '../i18n';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeader } from '../shared/section-header';

/** Sigle et teinte de chaque organisme : un repère visuel sans reprendre de logo officiel. */
const ISSUERS: Record<string, { short: string; hue: number }> = {
  'Google Cloud': { short: 'GC', hue: 214 },
  IBM: { short: 'IBM', hue: 205 },
  Meta: { short: 'M', hue: 228 },
  'Vanderbilt University': { short: 'VU', hue: 42 },
  'University of Michigan': { short: 'UM', hue: 50 },
};

/** Certifications publiées sur LinkedIn, chacune vérifiable sur Coursera. */
@Component({
  selector: 'app-certifications',
  imports: [SectionHeader, RevealDirective],
  template: `
    <section id="certifications" class="section">
      <div class="container">
        <app-section-header
          [eyebrow]="t.certifications.eyebrow"
          [title]="t.certifications.title"
          [highlight]="t.certifications.highlight"
          [subtitle]="t.certifications.subtitle(p.certifications.length)"
        />
        <ul class="grid">
          @for (c of p.certifications; track c.credentialId) {
            <li class="card cert" [class.featured]="c.featured" appReveal>
              <div class="top">
                <span class="mark" [style.--hue]="issuer(c.issuer).hue" aria-hidden="true">{{
                  issuer(c.issuer).short
                }}</span>
                <div class="who">
                  <span class="issuer">{{ c.issuer }}</span>
                  <span class="date">{{ t.certifications.obtained }} {{ c.date }}</span>
                </div>
              </div>
              <h3>{{ c.name }}</h3>
              <div class="chips">
                <span class="chip kind" [class.spec]="isSpecialization(c.kind)">{{ c.kind }}</span>
                @for (s of c.skills ?? []; track s) {
                  <span class="chip">{{ s }}</span>
                }
              </div>
              <div class="foot">
                <span class="id">{{ t.certifications.id }} {{ c.credentialId }}</span>
                <a
                  class="btn verify"
                  [href]="c.url"
                  target="_blank"
                  rel="noopener"
                  [attr.aria-label]="t.certifications.verifyLabel(c.name)"
                >
                  {{ t.certifications.verify }}
                </a>
              </div>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .grid {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
    }
    /* 3 colonnes : les 2 certifications mises en avant prennent 2 colonnes → 3 lignes pleines */
    .featured {
      grid-column: span 2;
    }
    .featured h3 {
      font-size: 20px;
    }
    /* Tablette : 2 colonnes, pas de mise en avant, la dernière carte seule prend toute la largeur */
    @media (max-width: 999px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .featured {
        grid-column: auto;
      }
      .featured h3 {
        font-size: 17px;
      }
      .cert:last-child:nth-child(odd) {
        grid-column: 1 / -1;
      }
    }
    @media (max-width: 640px) {
      .grid {
        grid-template-columns: minmax(0, 1fr);
      }
    }
    .cert {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 20px;
      min-width: 0;
    }
    .cert:hover {
      transform: translateY(-3px);
    }
    .top {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .mark {
      flex: 0 0 auto;
      width: 42px;
      height: 42px;
      border-radius: 12px;
      display: grid;
      place-items: center;
      font: 700 13px var(--font-mono);
      letter-spacing: 0.02em;
      color: var(--text);
      background: hsl(var(--hue) 80% 55% / 0.18);
      border: 1px solid hsl(var(--hue) 75% 55% / 0.45);
    }
    .who {
      display: grid;
      min-width: 0;
    }
    .issuer {
      font-weight: 600;
    }
    .date {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--muted);
    }
    h3 {
      font-size: 17px;
      line-height: 1.35;
      margin: 0;
      text-wrap: balance;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .kind.spec {
      color: var(--accent);
      border-color: currentColor;
    }
    .foot {
      margin-top: auto;
      padding-top: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }
    .id {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--muted);
    }
    .verify {
      padding: 8px 14px;
      font-size: 14px;
    }
  `,
})
export class Certifications {
  private readonly i18n = inject(I18n);
  protected get p() {
    return this.i18n.profile();
  }
  protected get t() {
    return this.i18n.t();
  }
  protected issuer(name: string) {
    return ISSUERS[name] ?? { short: name.slice(0, 2).toUpperCase(), hue: 260 };
  }
  protected isSpecialization(kind: string): boolean {
    return kind === 'Spécialisation' || kind === 'Specialization';
  }
}
