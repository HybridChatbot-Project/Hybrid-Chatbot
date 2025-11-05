export interface ConversationResponse {
  id: number;
  createDate: Date;
  isActive: number;
  userId: number;
  grade: number;
  comment: string;
  isClosed: boolean;
}

export interface ConversationTable {
  id: number;
  createDate: string;
  firstLine: string;
  grade: string;
  comment: string;
  closed: boolean;
}
