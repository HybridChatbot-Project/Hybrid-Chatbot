export interface AnxietyEvaluationResponse {
  id: number;
  grade: number;
  isActive: number;
  result: ResultResponse;
  userId: number;
  createDate: Date;
}

export interface AnxietyEvaluationRequest {
  grade: number;
  resultId: number;
  userId: number;
}

export interface ResultResponse {
  id: number;
  result: string;
  isActive: number;
}
