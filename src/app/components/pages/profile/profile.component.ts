import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
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

type GenreOption = { id: number; name: string };

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/;
const EMAIL_DOT_COM_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/i;
const PERU_PHONE_REGEX = /^(?:\+?51)?9\d{8}$/;

function parseDateInput(value: any): Date | null {
  if (!value) return null;

  if (value instanceof Date) return value;

  if (typeof value === 'string') {
    const parts = value.split(/[\/\-]/).map((p) => p.trim());
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      const day = Number(dd);
      const month = Number(mm) - 1;
      const year = Number(yyyy);
      const date = new Date(year, month, day);
      if (
        !isNaN(date.getTime()) &&
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
      ) {
        return date;
      }
    }
  }

  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

function validBirthDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) {
    return null;
  }

  const date = parseDateInput(value);
  if (!date) {
    return { invalidDate: true };
  }

  const now = new Date();
  const minDate = new Date('1900-01-01');
  if (date < minDate || date > now) {
    return { invalidDate: true };
  }

  return null;
}

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
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern(NAME_REGEX),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern(NAME_REGEX),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(EMAIL_DOT_COM_REGEX),
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(PERU_PHONE_REGEX),
    ]),
    birthDate: new FormControl('', [Validators.required, validBirthDate]),
    genre: new FormControl(null, [Validators.required]),
  });

  editForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern(NAME_REGEX),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern(NAME_REGEX),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(EMAIL_DOT_COM_REGEX),
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(PERU_PHONE_REGEX),
    ]),
    birthDate: new FormControl('', [Validators.required, validBirthDate]),
    genre: new FormControl(null, [Validators.required]),
    password: new FormControl('', []),
  });

  constructor(
    private userService: UserService,
    private genreService: GenreService,
    private cloudinaryService: CluodinaryService
  ) {}

  ngOnInit(): void {
    this.profileForm.disable();
    this.profileForm.controls['genre'].enable();
    this.listGenres();
    this.loadUserProfile(this.userId);
  }

  private readonly fallbackGenres: GenreOption[] = [
    { id: 1, name: 'Masculino' },
    { id: 2, name: 'Femenino' },
  ];
  genres: GenreOption[] = [...this.fallbackGenres];
  listGenres(): void {
    this.genreService.listGenres().subscribe({
      next: (response) => {
        if (response.status_code === 200) {
          const apiGenres = response.data
            ?.map((x: any) => ({ id: x.id, name: x.genre }))
            .filter((item: GenreOption) => !!item.name);

          this.genres = apiGenres?.length
            ? apiGenres
            : [...this.fallbackGenres];
        }
      },
      error: () => {
        this.genres = [...this.fallbackGenres];
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
      birthDate: parseDateInput(this.editForm.value.birthDate) || new Date(),
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
            this.formatDateDayMonthYear(
              new Date(response.data?.birthDate || '')
            )
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

  get phoneNumberDisplay(): string {
    return this.profileForm.value.phoneNumber || '—';
  }

  get birthDateDisplay(): string {
    const date = this.profileForm.value.birthDate;
    if (!date) {
      return '—';
    }

    try {
      const parsed = parseDateInput(date);
      if (!parsed) return '—';
      return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(parsed);
    } catch {
      return '—';
    }
  }

  private formatDateDayMonthYear(date: Date): string {
    if (!date || isNaN(date.getTime())) return '';
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  get selectedGenreLabel(): string {
    const genreId = this.profileForm.value.genre;
    const genre = this.genres.find((g) => g.id === genreId);
    return genre ? genre.name : '—';
  }

  showFieldError(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (!control) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (control.hasError('pattern')) {
      if (controlName === 'email') {
        return 'El correo debe terminar en .com';
      }
      if (controlName === 'phoneNumber') {
        return 'Ingresa un celular peruano válido (9 dígitos).';
      }
      return 'Solo se permiten letras y espacios.';
    }
    if (control.hasError('invalidDate')) {
      return 'Ingresa una fecha válida (dd/mm/aaaa) anterior a hoy.';
    }
    return '';
  }
}
