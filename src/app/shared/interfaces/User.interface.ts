import { NgModel } from '@angular/forms';
import { Genres } from './Genre.interface';

export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  birthDate: Date;
  phoneNumber: string;
  gender: number;
  profileImageUrl?: string;
  profileImagePublicId?: string;
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
  profileImage?: string;
  publicImageId?: string;
}

export interface UserImageRequest {
  userId: number;
  image: string;
  imageId: string;
}
