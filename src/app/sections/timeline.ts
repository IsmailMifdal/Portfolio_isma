import { Component, inject } from '@angular/core';
import { I18n } from '../i18n';
import { RevealDirective } from '../shared/reveal.directive';
import { SectionHeader } from '../shared/section-header';

const isTodo = (s?: string) => !!s && s.includes('À compléter');

/** Expériences professionnelles (frise chronologique). */
@Component({
  selector: 'app-experience',
  imports: [SectionHeader, RevealDirective],
  template: `
    <section id="experience" class="section">
      <div class="container">
        <app-section-header [eyebrow]="t.experience.eyebrow" [title]="t.experience.title" [highlight]="t.experience.highlight" />
        <ol class="timeline">
          @for (e of p.experiences; track $index) {
            <li appReveal>
              <span class="node"></span>
              <div class="card">
                <div class="head">
                  <div>
                    <h3 [class.todo]="todo(e.role)">{{ e.role }}</h3>
                    <p class="company" [class.todo]="todo(e.company)">
                      {{ e.company }}@if (e.location && !todo(e.location)) { · {{ e.location }} }
                    </p>
                  </div>
                  <div class="meta">
                    @if (e.type) {
                      <span class="chip">{{ e.type }}</span>
                    }
                    <span class="period" [class.todo]="todo(e.period)">{{ e.period }}</span>
                  </div>
                </div>
                <p [class.todo]="todo(e.summary)">{{ e.summary }}</p>
                <ul class="hl">
                  @for (h of e.highlights; track $index) {
                    <li [class.todo]="todo(h)">{{ h }}</li>
                  }
                </ul>
                @if (e.stack.length) {
                  <div class="stack">
                    @for (s of e.stack; track s) {
                      <span class="chip">{{ s }}</span>
                    }
                  </div>
                }
              </div>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styleUrl: './timeline.scss',
})
export class ExperienceSection {
  private readonly i18n = inject(I18n);
  protected get p() {
    return this.i18n.profile();
  }
  protected get t() {
    return this.i18n.t();
  }
  protected readonly todo = isTodo;
}

/** Parcours académique. */
@Component({
  selector: 'app-education',
  imports: [SectionHeader, RevealDirective],
  template: `
    <section id="formation" class="section">
      <div class="container">
        <app-section-header [eyebrow]="t.education.eyebrow" [title]="t.education.title" [highlight]="t.education.highlight" />
        <ol class="timeline">
          @for (e of p.education; track $index) {
            <li appReveal>
              <span class="node"></span>
              <div class="card">
                <div class="head">
                  <div>
                    <h3 [class.todo]="todo(e.degree)">🎓 {{ e.degree }}</h3>
                    <p class="company" [class.todo]="todo(e.school)">
                      {{ e.school }}@if (e.location && !todo(e.location)) { · {{ e.location }} }
                    </p>
                  </div>
                  <span class="period" [class.todo]="todo(e.period)">{{ e.period }}</span>
                </div>
                @if (e.details?.length) {
                  <ul class="hl">
                    @for (d of e.details; track $index) {
                      <li [class.todo]="todo(d)">{{ d }}</li>
                    }
                  </ul>
                }
              </div>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
  styleUrl: './timeline.scss',
})
export class EducationSection {
  private readonly i18n = inject(I18n);
  protected get p() {
    return this.i18n.profile();
  }
  protected get t() {
    return this.i18n.t();
  }
  protected readonly todo = isTodo;
}
