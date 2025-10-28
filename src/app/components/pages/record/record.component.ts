import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [RouterModule, TableModule, DatePipe, ButtonModule],
  templateUrl: './record.component.html',
  styleUrl: './record.component.css',
})
export class RecordComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  infoData: any[] = [
    {
      idSesion: 1,
      date: '2024-06-15 14:30',
      description: 'Conversación sobre soporte técnico',
    },
    {
      idSesion: 2,
      date: '2025-06-15 14:30',
      description: 'Conversación sobre cosas variadas',
    },
  ];

  viewDetails(selectedRecord: any) {
    this.router.navigate(['/hybridchatbot/chat'], {
      queryParams: { id: selectedRecord.idSesion },
    });
  }
}
