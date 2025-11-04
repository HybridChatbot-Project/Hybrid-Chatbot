import { Genres } from './Genre.interface';

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  birthDate: Date;
  phoneNumber: string;
  gender: number;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  phoneNumber: string;
  genre: Genres;
  isActive: number;
}
