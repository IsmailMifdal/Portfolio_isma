import { Component, input } from '@angular/core';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'app-section-header',
  imports: [RevealDirective],
  template: `
    <header appReveal>
      <span class="eyebrow">{{ eyebrow() }}</span>
      <h2>{{ title() }} <span class="gradient-text">{{ highlight() }}</span></h2>
      @if (subtitle()) {
        <p>{{ subtitle() }}</p>
      }
    </header>
  `,
  styles: `
    header {
      margin-bottom: 48px;
      max-width: 720px;
    }
    .eyebrow {
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--accent);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h2 {
      font-size: clamp(30px, 4.5vw, 44px);
      margin-top: 10px;
    }
    p {
      color: var(--muted);
      margin: 14px 0 0;
      font-size: 17px;
    }
  `,
})
export class SectionHeader {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly highlight = input('');
  readonly subtitle = input('');
}
