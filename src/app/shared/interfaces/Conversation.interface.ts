export interface ConversationResponse {
  id: number;
  createDate: Date;
  isActive: number;
  userId: number;
  grade: number;
  comment: string;
}

export interface ConversationTable {
  id: number;
  createDate: string;
  firstLine: string;
  grade: number;
  comment: string;
}
