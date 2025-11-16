import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Button, ButtonModule } from 'primeng/button';
import {
  ChatMessage,
  MessageRequest,
  MessageResponse,
} from '../../../shared/interfaces/Chat.interface';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from '../../../shared/services/message.service';
import { environments } from '../../../../environments/environment';
import * as CryptoJS from 'crypto-js';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ConversationService } from '../../../shared/services/conversation.service';
import { ConversationCloseRequest } from '../../../shared/interfaces/Conversation.interface';
import { StatisticsService } from '../../../shared/services/statistics.service';
import { CanComponentDeactivate } from '../../../shared/guards/ChatDeactivateGuard.guard';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    RouterModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmationDialogComponent,
    DialogModule,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent
  implements OnInit, OnDestroy, CanComponentDeactivate
{
  chatForm: FormGroup;
  messages: MessageResponse[] = [];
  isBotTurn: boolean = false;
  conversationId?: number;
  closed: boolean = true;
  showDialog: boolean = false;
  showDialogComment: boolean = false;
  currentUserId: number = Number(localStorage.getItem('userId'));
  conversationIdStatistics?: number;
  private hasUserSentMessage: boolean = false;
  showNavigationWarning: boolean = false;
  private conversationWasClosed: boolean = false;
  showDialogConversationEvaluation: boolean = false;
  rating: number = 0;
  hoverRating: number = 0;
  comment: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private conversationService: ConversationService,
    private statisticsService: StatisticsService
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.messages.push({
      message: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
      conversationId: 0,
      sequence: 0,
      senderType: 'bot',
    });

    this.route.queryParams.subscribe((params) => {
      const encodedData = params['data'];
      if (encodedData) {
        try {
          const cipher = decodeURIComponent(encodedData);
          const bytes = CryptoJS.AES.decrypt(cipher, environments.secretKeyUrl);
          const decrypted = bytes.toString(CryptoJS.enc.Utf8);

          if (decrypted) {
            const dataProcessed = JSON.parse(decrypted);
            console.log('data processed', dataProcessed);

            this.conversationId = dataProcessed.id;
            this.closed = dataProcessed.closed;

            if (this.conversationId) {
              this.chatForm.disable();
              this.listMessages(this.conversationId);
            }
          }
        } catch (error) {
          console.error('Error al descifrar la data:', error);
        }
      } else {
        this.conversationService
          .createConversation(this.currentUserId)
          .subscribe({
            next: (response) => {
              if (response.status_code === 200) {
                this.conversationId = response.data.id;
                console.log('nueva data conversation', response.data);
              }
            },
          });

        this.statisticsService
          .createConversation(this.currentUserId)
          .subscribe({
            next: (response) => {
              if (response.status_code === 200) {
                this.conversationIdStatistics = response.data.id;
                console.log('nueva data statistics', response.data);
              }
            },
          });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.conversationId && !this.hasUserSentMessage) {
      this.conversationService
        .deleteConversation(this.conversationId!)
        .subscribe({
          next: (response) => {
            if (response.status_code == 200) {
              console.log(response.data);
            }
          },
        });
      this.statisticsService
        .deleteConversation(this.conversationIdStatistics!)
        .subscribe({
          next: (response) => {
            if (response.status_code == 200) {
              {
                console.log(response.data);
              }
            }
          },
        });
    }
  }

  sendMessage(): void {
    if (this.chatForm.invalid || this.isBotTurn) return;

    const text = this.chatForm.value.message.trim();
    if (!text) return;

    if (!this.hasUserSentMessage) {
      this.hasUserSentMessage = true;
      this.closed = false;
    }

    const newMessage: MessageRequest = {
      message: text,
      conversationId: this.conversationId ?? 0,
      sequence: this.messages.length,
      senderType: 'user',
    };

    this.messages.push(newMessage);
    this.chatForm.reset();

    this.scrollChatToBottom();

    this.isBotTurn = true;

    //IMPLEMENTACION BACKEND
    // this.messageService.saveMessage(newMessage).subscribe({
    //   next: () => {
    //     setTimeout(() => this.botReply(), 1000);
    //   },
    //   error: (err: any) => console.error('Error al guardar mensaje:', err),
    // });
    setTimeout(() => {
      this.botReply(), 1000;
    });
  }

  private scrollChatToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-scroll-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);
  }

  private botReply(): void {
    const botMessage: MessageResponse = {
      message: 'Entendido. Procesando tu solicitud... 🤖✅',
      conversationId: this.conversationId ?? 0,
      sequence: this.messages.length,
      senderType: 'bot',
    };

    this.messages.push(botMessage);
    this.scrollChatToBottom();

    this.isBotTurn = false;
  }

  listMessages(id: number) {
    this.messageService.listMessagesByConversationId(id).subscribe({
      next: (response) => {
        if (response && response.data) {
          const orderedMessages = response.data.sort(
            (a: MessageResponse, b: MessageResponse) => a.sequence - b.sequence
          );

          this.messages = [this.messages[0], ...orderedMessages];

          const hasUserMessages = orderedMessages.some(
            (msg: MessageResponse) => msg.senderType === 'user'
          );
          if (hasUserMessages) {
            this.hasUserSentMessage = true;
          }

          const lastSender =
            orderedMessages[orderedMessages.length - 1]?.senderType;
          this.isBotTurn = lastSender === 'user';
        }
        this.scrollChatToBottom();
      },
      error: (err) => console.error('Error al listar mensajes:', err),
    });
  }

  actionDialog() {
    const req: ConversationCloseRequest = {
      conversationId: 0,
      grade: this.rating || 0,
      userComment: this.comment.trim() || '',
    };

    req.conversationId = this.conversationId!;
    this.conversationService.closeConversationById(req).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          console.log('Conversacion cerrado con exito');
          this.handleClose();
        }
      },
    });

    req.conversationId = this.conversationIdStatistics!;
    this.statisticsService.closeConversation(req).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          console.log('Conversacion cerrado en statistics con exito');
          this.handleClose();
        }
      },
    });
  }

  handleClose() {
    this.conversationWasClosed = true;
    this.showDialog = false;
    this.showDialogComment = true;
    this.chatForm.disable();
    this.closed = true;
    this.showDialogConversationEvaluation = false;
  }

  canDeactivate(): boolean {
    if (this.hasUserSentMessage && !this.conversationWasClosed) {
      this.showNavigationWarning = true;
      return false;
    }
    return true;
  }

  cancelNavigation(): void {
    this.showNavigationWarning = false;
  }

  confirmCloseAndNavigate(): void {
    this.showNavigationWarning = false;
    this.showDialog = false;
    this.showDialogConversationEvaluation = true;
  }

  setRating(star: number): void {
    this.rating = star;
  }

  setHoverRating(star: number): void {
    this.hoverRating = star;
  }

  resetHoverRating(): void {
    this.hoverRating = 0;
  }

  resetRatingForm(): void {
    this.rating = 0;
    this.hoverRating = 0;
    this.comment = '';
  }
}
