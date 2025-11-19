export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export interface MessageResponse {
  id?: number;
  message: string;
  conversationId: number;
  sequence: number;
  senderType: string;
}

export interface MessageRequest {
  message: string;
  conversationId: number;
  sequence: number;
  senderType: string;
  userName?: string;
}
