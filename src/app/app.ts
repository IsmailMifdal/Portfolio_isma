import { Component } from '@angular/core';
import { ChatWidget } from './chat/chat-widget';
import { About } from './sections/about';
import { Contact } from './sections/contact';
import { Hero } from './sections/hero';
import { Navbar } from './sections/navbar';
import { Projects } from './sections/projects';
import { Skills } from './sections/skills';
import { EducationSection, ExperienceSection } from './sections/timeline';

@Component({
  selector: 'app-root',
  imports: [Navbar, Hero, About, Skills, ExperienceSection, EducationSection, Projects, Contact, ChatWidget],
  template: `
    <app-navbar />
    <main>
      <app-hero (askAssistant)="assistant.openPanel()" />
      <app-about />
      <app-skills />
      <app-experience />
      <app-education />
      <app-projects />
      <app-contact (askAssistant)="assistant.openPanel()" />
    </main>
    <app-chat-widget #assistant />
  `,
})
export class App {}
