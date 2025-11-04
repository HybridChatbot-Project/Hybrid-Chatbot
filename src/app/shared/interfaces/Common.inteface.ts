export interface BaseResponse<T> {
  status_code: number;
  message: string;
  data: T;
}

export interface BaseResponseList<T> {
  status_code: number;
  message: string;
  data: T[];
}
