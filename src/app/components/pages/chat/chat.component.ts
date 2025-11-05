import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    RouterModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmationDialogComponent,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {
  chatForm: FormGroup;
  // messages: ChatMessage[] = [
  //   {
  //     sender: 'bot',
  //     text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
  //   },
  // ];
  messages: MessageResponse[] = [];
  isBotTurn: boolean = false;
  conversationId?: number;
  closed?: boolean;
  showDialog: boolean = false;
  showDialogComment: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private conversationService: ConversationService
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
      }
    });
  }

  sendMessage(): void {
    if (this.chatForm.invalid || this.isBotTurn) return;

    const text = this.chatForm.value.message.trim();
    if (!text) return;

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
    this.conversationService
      .closeConversationById(this.conversationId!)
      .subscribe({
        next: (response) => {
          if (response.status_code === 200) {
            console.log('Conversacion cerrado con exito');
            this.showDialog = false;
            this.showDialogComment = true;
          }
        },
      });
  }
}
