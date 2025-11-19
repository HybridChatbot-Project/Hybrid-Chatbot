import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environment';
import { CloudinaryResponse } from '../interfaces/Cloudinary.interface';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CluodinaryService {
  constructor(private http: HttpClient) {}

  private cloudName = environments.cloudinary.cloud_name;
  private uploadPreset = environments.cloudinary.upload_preset;
  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  private deleteUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;

  uploadImage(file: File, folder?: string): Observable<CloudinaryResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    if (folder) {
      formData.append('folder', folder);
    }

    return this.http.post<CloudinaryResponse>(this.uploadUrl, formData);
  }

  deleteImage(publicId: string): Observable<any> {
    return this.http.post<any>(this.deleteUrl, { public_id: publicId });
  }

  generateUniqueFileName(email: string): string {
    const timestamp = Date.now();
    const sanitizedEmail = email.replace(/[@.]/g, '_');
    return `user_${sanitizedEmail}_${timestamp}`;
  }

  getOptimizedUrl(publicId: string, width?: number, height?: number): string {
    let transformation = 'f_auto,q_auto';

    if (width && height) {
      transformation += `,w_${width},h_${height},c_fill`;
    } else if (width) {
      transformation += `,w_${width}`;
    }

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformation}/${publicId}`;
  }
}
