import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button, ButtonModule } from 'primeng/button';
import { ChatMessage } from '../../../shared/interfaces/Chat.interface';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterModule, ButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  chatForm: FormGroup;
  messages: ChatMessage[] = [
    {
      sender: 'bot',
      text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
    },
  ];
  viewMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  sendMessage(): void {
    if (this.chatForm.invalid) return;

    const text = this.chatForm.value.message.trim();
    if (!text) return;

    this.messages.push({ sender: 'user', text });
    this.chatForm.reset();

    this.scrollChatToBottom();

    setTimeout(() => {
      this.messages.push({
        sender: 'bot',
        text: 'Procesando tu solicitud... ✅',
      });
      this.scrollChatToBottom();
    }, 800);
  }

  private scrollChatToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-scroll-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);
  }
}
