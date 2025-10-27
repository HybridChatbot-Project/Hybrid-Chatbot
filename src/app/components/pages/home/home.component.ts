import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import path from 'path';
import { title } from 'process';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private sanitizer: DomSanitizer) {
    this.homeRoutes = [
      {
        title: 'Chat',
        subtitle: 'Usa nuestro asistente virtual',
        path: '/hybridchatbot/chat',
        icon: this.sanitize(`<svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7 8h10M7 12h6m5 8l-4-4H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z"
      />
    </svg>`),
      },
      {
        title: 'Historial',
        subtitle: 'Mira tu historial de conversaciones',
        path: '/hybridchatbot/record',
        icon: this.sanitize(`<svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>`),
      },
      {
        title: 'Recursos',
        subtitle: 'Revisa el contenido informativo que tenemos para ti',
        path: '/hybridchatbot/resources',
        icon: this.sanitize(`<svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4 5h16M4 10h16M4 15h16M4 20h16"
      />
    </svg>`),
      },
      {
        title: 'Estadísticas',
        subtitle: 'Revisa tu progreso actual',
        path: '/hybridchatbot/statistics',
        icon: this.sanitize(`<svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-8 h-8"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4 19h16M6 17V9m4 8V5m4 12v-4m4 4v-7"
      />
    </svg>`),
      },
    ];
  }

  name: string = 'Usuario';
  homeRoutes: any = [];

  sanitize(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
