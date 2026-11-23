import { Component, computed, inject, signal } from '@angular/core';
import { I18n } from '../i18n';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeader } from '../shared/section-header';

@Component({
  selector: 'app-skills',
  imports: [SectionHeader, RevealDirective],
  template: `
    <section id="competences" class="section">
      <div class="container">
        <app-section-header
          [eyebrow]="t.skills.eyebrow"
          [title]="t.skills.title"
          [highlight]="t.skills.highlight"
          [subtitle]="t.skills.subtitle"
        />

        <div class="tabs" role="tablist" [attr.aria-label]="t.skills.tabs" appReveal>
          @for (g of p.skillGroups; track g.id) {
            <button
              role="tab"
              type="button"
              [attr.aria-selected]="g.id === active()"
              [class.active]="g.id === active()"
              (click)="active.set(g.id)"
            >
              {{ g.icon }} {{ g.title }}
            </button>
          }
        </div>

        @if (current(); as g) {
          <div class="card panel" role="tabpanel" appReveal>
            <p class="desc">{{ g.description }}</p>
            <div class="items">
              @for (item of g.items; track item) {
                <span class="chip">{{ item }}</span>
              }
            </div>
          </div>
        }

        <div class="split">
          <div appReveal>
            <h3>{{ t.skills.architectures }}</h3>
            <ul class="list">
              @for (a of p.architectures; track a.name) {
                <li class="card">
                  <strong>{{ a.name }}</strong>
                  <span>{{ a.description }}</span>
                </li>
              }
            </ul>
          </div>
          <div appReveal>
            <h3>{{ t.skills.webServices }}</h3>
            <ul class="list">
              @for (w of p.webServices; track w.name) {
                <li class="card">
                  <strong>{{ w.name }}</strong>
                  <span>{{ w.description }}</span>
                </li>
              }
            </ul>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 18px;
    }
    .tabs button {
      padding: 10px 16px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--muted);
      font: 600 14px var(--font);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .tabs button.active {
      color: #fff;
      background: var(--gradient);
      border-color: transparent;
    }
    .panel {
      margin-bottom: 56px;
    }
    .desc {
      color: var(--muted);
      margin: 0 0 16px;
    }
    .items {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .items .chip {
      font-size: 14px;
      padding: 7px 14px;
    }
    .split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
    }
    h3 {
      font-size: 22px;
      margin-bottom: 16px;
    }
    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 10px;
    }
    .list .card {
      padding: 16px 18px;
      display: grid;
      gap: 4px;
    }
    .list span {
      color: var(--muted);
      font-size: 15px;
    }
    @media (max-width: 860px) {
      .split {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class Skills {
  private readonly i18n = inject(I18n);
  protected get p() {
    return this.i18n.profile();
  }
  protected get t() {
    return this.i18n.t();
  }
  protected readonly active = signal(this.i18n.profile().skillGroups[0]?.id ?? '');
  protected readonly current = computed(() => this.p.skillGroups.find((g) => g.id === this.active()));
}
