import { Component, viewChild } from '@angular/core';
import { ChatWidget } from './chat/chat-widget';
import { About } from './sections/about';
import { Certifications } from './sections/certifications';
import { Contact } from './sections/contact';
import { Hero } from './sections/hero';
import { Navbar } from './sections/navbar';
import { Projects } from './sections/projects';
import { Skills } from './sections/skills';
import { EducationSection, ExperienceSection } from './sections/timeline';

@Component({
  selector: 'app-root',
  imports: [Navbar, Hero, About, Skills, ExperienceSection, EducationSection, Certifications, Projects, Contact, ChatWidget],
  template: `
    <app-navbar />
    <main>
      <app-hero (askAssistant)="assistant()?.openPanel()" />
      <!-- Sous la ligne de flottaison : chargé juste après l'affichage initial (JS du démarrage allégé) -->
      @defer (on idle) {
        <app-about />
        <app-skills />
        <app-experience />
        <app-education />
        <app-certifications />
        <app-projects />
        <app-contact (askAssistant)="assistant()?.openPanel()" />
      } @placeholder {
        <div class="below-fold" aria-hidden="true"></div>
      }
    </main>
    @defer (on idle) {
      <app-chat-widget #assistant />
    }
  `,
  styles: `
    .below-fold {
      min-height: 100vh;
    }
  `,
})
export class App {
  protected readonly assistant = viewChild<ChatWidget>('assistant');
}
