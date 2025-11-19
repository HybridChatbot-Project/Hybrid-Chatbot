import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { UserRequest } from '../../../shared/interfaces/User.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { response } from 'express';
import { GenreService } from '../../../shared/services/genre.service';
import { CluodinaryService } from '../../../shared/services/cluodinary.service';
import { error } from 'console';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    RouterModule,
    ImageModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private genreService: GenreService,
    private cloudinaryService: CluodinaryService
  ) {}

  selectedImage?: string;
  selectedFile?: File;
  showPolicies: boolean = false;
  isAccepted: boolean = false;
  isUploading: boolean = false;
  uploadProgress: number = 0;

  signup = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    birthDate: new FormControl(),
    genre: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    confirmPassword: new FormControl(),
    phoneNumber: new FormControl(),
    acceptTerms: new FormControl(false),
  });

  genres: any[] = [
    { id: 1, name: 'Masculino' },
    { id: 2, name: 'Femenino' },
  ];

  ngOnInit(): void {
    this.listGenres();
  }

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
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('La imagen no debe superar los 10MB');
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImage = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  onCheckboxClick(event: CheckboxChangeEvent) {
    this.signup.get('acceptTerms')?.setValue(false);
    this.showPolicies = true;
  }

  onAcceptPolicies() {
    this.isAccepted = true;
    this.signup.get('acceptTerms')?.setValue(true);
    this.showPolicies = false;
  }

  onCancelPolicies() {
    this.isAccepted = false;
    this.signup.get('acceptTerms')?.setValue(false);
    this.showPolicies = false;
  }

  onSignUp(): void {
    if (
      this.signup.valid &&
      this.isAccepted &&
      this.signup.value.password === this.signup.value.confirmPassword
    ) {
      this.isUploading = true;
      if (this.selectedFile) {
        this.cloudinaryService
          .uploadImage(this.selectedFile, 'user_profiles')
          .subscribe({
            next: (response) => {
              console.log('Imagen subida a Cloudinary:', response);
              this.registerUser(response.secure_url, response.public_id);
            },
            error: (error) => {
              console.error('Error al subir imagen:', error);
              this.isUploading = false;
              alert('Error al subir la imagen. Intenta nuevamente.');
            },
          });
      } else {
        this.registerUser();
      }
    }
  }

  registerUser(imageUrl?: string, publicId?: string): void {
    const formRegister: UserRequest = {
      firstName: this.signup.value.firstName!,
      lastName: this.signup.value.lastName!,
      birthDate: this.signup.value.birthDate!,
      gender: this.signup.value.genre!,
      email: this.signup.value.email!,
      password: this.signup.value.password!,
      phoneNumber: this.signup.value.phoneNumber!,
      profileImageUrl: imageUrl,
      profileImagePublicId: publicId,
    };
    this.authService.registerUser(formRegister).subscribe({
      next: (response) => {
        this.isUploading = false;
        if (response.status_code === 200) {
          console.log('Usuario registrado con éxito');
          this.goToLogin();
        }
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar el usuario. Intenta nuevamente.');
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], {
      relativeTo: this.route,
    });
  }
}
