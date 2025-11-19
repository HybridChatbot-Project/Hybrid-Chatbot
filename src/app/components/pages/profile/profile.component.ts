import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Button, ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { first, last } from 'rxjs';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserService } from '../../../shared/services/user.service';
import { GenreService } from '../../../shared/services/genre.service';
import { DropdownModule } from 'primeng/dropdown';
import {
  UserImageRequest,
  UserRequest,
} from '../../../shared/interfaces/User.interface';
import { CluodinaryService } from '../../../shared/services/cluodinary.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ImageModule,
    CommonModule,
    CalendarModule,
    ButtonModule,
    DialogModule,
    ConfirmationDialogComponent,
    DropdownModule,
    ImageModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  selectedImage: string = 'assets/images/logo.png';
  selectedFile?: File;
  loadImageId?: string;
  showEditForm: boolean = false;
  showConfirmationDialog: boolean = false;
  userId: number = Number(localStorage.getItem('userId'));
  contentDialog: any = {
    title: '',
    description: '',
    type: '',
  };

  profileForm: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    phoneNumber: new FormControl(),
    birthDate: new FormControl(),
    genre: new FormControl(),
  });

  editForm: FormGroup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    phoneNumber: new FormControl(),
    birthDate: new FormControl(),
    genre: new FormControl(),
    password: new FormControl(),
  });

  constructor(
    private userService: UserService,
    private genreService: GenreService,
    private cloudinaryService: CluodinaryService
  ) {}

  ngOnInit(): void {
    this.profileForm.disable();
    this.listGenres();
    this.loadUserProfile(this.userId);
  }

  genres: any[] = [];
  listGenres(): void {
    this.genreService.listGenres().subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          this.genres = response.data.map((x) => ({ id: x.id, name: x.genre }));
        }
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImage = reader.result as string;
      console.log('✅ Preview cargado');
    };

    reader.readAsDataURL(file);
    this.uploadImageToCloudinary(this.selectedFile);
  }

  uploadImageToCloudinary(file: File): void {
    this.cloudinaryService.deleteImage(this.loadImageId!).subscribe({
      next: (response) => {
        console.log('✅ Imagen eliminada de Cloudinary:', response);
      },
    });
    this.cloudinaryService.uploadImage(file, 'user_profiles').subscribe({
      next: (response) => {
        console.log('✅ Imagen subida a Cloudinary:', response);
        this.selectedImage = response.secure_url;
        this.loadImageId = response.public_id;
        this.updateProfileImage();
      },
      error: (error) => {
        console.error('❌ Error al subir imagen:', error);
        alert('Error al subir la imagen. Intenta nuevamente.');
        this.loadUserProfile(this.userId);
      },
    });
  }

  editProfile(): void {
    const editData: UserRequest = {
      firstName: this.editForm.value.firstName,
      lastName: this.editForm.value.lastName,
      email: this.editForm.value.email,
      birthDate: this.editForm.value.birthDate,
      phoneNumber: this.editForm.value.phoneNumber,
      password: this.editForm.value.password,
      gender: this.editForm.value.genre,
    };
    this.userService.updateUserById(this.userId, editData).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          console.log('Profile updated');
        }
      },
    });
  }

  deleteProfile(): void {
    this.userService.deleteUserById(this.userId).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          console.log('Profile deleted');
        }
      },
    });
  }

  switchActionDialog(): void {
    if (this.contentDialog.type === 'edit') {
      this.editProfile();
      this.showEditForm = false;
      this.showConfirmationDialog = false;
    } else if (this.contentDialog.type === 'delete') {
      this.deleteProfile();
      this.showConfirmationDialog = false;
    }
  }

  editModal(action: string): void {
    if (action === 'editar') {
      this.showEditForm = true;
      this.contentDialog = {
        title: '¿Está seguro de actualizar los datos?',
        description: '',
        type: 'edit',
      };
    } else if (action === 'eliminar') {
      this.contentDialog = {
        title: '¿Está seguro de eliminar la cuenta?',
        description: 'Todos los datos se eliminarán permanentemente',
        type: 'delete',
      };
      this.showConfirmationDialog = true;
    }
  }

  loadUserProfile(userId: number): void {
    this.userService.findUserById(userId).subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          //FORM PRINCIPAL
          console.log(response.data);
          this.profileForm.controls['firstName'].setValue(
            response.data?.firstName
          );
          this.profileForm.controls['lastName'].setValue(
            response.data?.lastName
          );
          this.profileForm.controls['email'].setValue(response.data?.email);
          this.profileForm.controls['phoneNumber'].setValue(
            response.data?.phoneNumber
          );
          this.profileForm.controls['birthDate'].setValue(
            new Date(response.data?.birthDate || '')
          );
          this.profileForm.controls['genre'].setValue(response.data?.genre.id);

          if (response.data?.profileImage) {
            this.selectedImage = response.data.profileImage;
            this.loadImageId = response.data.publicImageId;
            console.log('✅ Imagen asignada:', this.selectedImage);
          } else {
            console.log('⚠️ No hay imagen, usando default');
          }

          //FORM EDICIÓN
          this.editForm.controls['firstName'].setValue(
            response.data?.firstName
          );
          this.editForm.controls['lastName'].setValue(response.data?.lastName);
          this.editForm.controls['email'].setValue(response.data?.email);
          this.editForm.controls['phoneNumber'].setValue(
            response.data?.phoneNumber
          );
          this.editForm.controls['birthDate'].setValue(
            new Date(response.data?.birthDate || '')
          );
          this.editForm.controls['genre'].setValue(response.data?.genre.id);
        }
      },
    });
  }

  updateProfileImage(): void {
    const req: UserImageRequest = {
      userId: this.userId,
      image: this.selectedImage,
      imageId: this.loadImageId!,
    };
    this.userService.updateImageUserById(req).subscribe({
      next: (response) => {
        if (response.status_code == 200) {
          console.log('Imagen de perfil actualizada en el servidor');
          this.loadUserProfile(this.userId);
        }
      },
    });
  }
}
