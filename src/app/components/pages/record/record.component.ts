import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { ConversationService } from '../../../shared/services/conversation.service';
import { ConversationTable } from '../../../shared/interfaces/Conversation.interface';
import { MessageService } from '../../../shared/services/message.service';
import { forkJoin } from 'rxjs';
import { environments } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [RouterModule, TableModule, DatePipe, ButtonModule],
  providers: [DatePipe],
  templateUrl: './record.component.html',
  styleUrl: './record.component.css',
})
export class RecordComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {}

  userId: number = Number(localStorage.getItem('userId'));
  secretKey: string = environments.secretKeyUrl;

  ngOnInit(): void {
    this.listConversations();
  }

  infoData: ConversationTable[] = [];
  listConversations() {
    this.conversationService.listConversationsByUserId(this.userId).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          const requests = response.data.map((x: any) =>
            this.messageService.findFirstLineConversation(x.id)
          );

          forkJoin(requests).subscribe((lines: string[]) => {
            this.infoData = response.data.map((x: any, i: number) => ({
              id: x.id,
              createDate:
                this.datePipe.transform(x.createDate, 'dd-MM-yyyy HH:mm') || '',
              firstLine: lines[i] || 'Sin mensajes',
              grade: x.grade ? x.grade.toString() : 'Sin calificación',
              comment: x.comment || 'Sin comentarios',
              closed: x.isClosed || false,
            }));
          });
        }
      },
    });
  }

  findLineConversation(id: number) {
    this.messageService.findFirstLineConversation(id).subscribe({
      next: (response) => {
        return response;
      },
    });
  }

  viewDetails(selectedRecord: any) {
    const params = { id: selectedRecord.id, closed: selectedRecord.closed };
    const cipher = CryptoJS.AES.encrypt(
      JSON.stringify(params),
      this.secretKey
    ).toString();
    this.router.navigate(['/hybridchatbot/chat'], {
      queryParams: { data: encodeURIComponent(cipher) },
    });
  }
}
