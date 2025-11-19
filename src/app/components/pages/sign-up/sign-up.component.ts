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
import { GenreService } from '../../../shared/services/genre.service';
import { CluodinaryService } from '../../../shared/services/cluodinary.service';
import { error } from 'console';
import { MessageService } from 'primeng/api';

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ\s]+$/;
const EMAIL_DOT_COM_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/i;
const PERU_PHONE_REGEX = /^(?:\+?51)?9\d{8}$/;

function validBirthDate(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  if (isNaN(date.getTime())) return { invalidDate: true };

  const now = new Date();
  const minDate = new Date('1900-01-01');
  if (date < minDate || date > now) return { invalidDate: true };

  return null;
}

function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordMismatch: true };
}

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
    private cloudinaryService: CluodinaryService,
    private messageService: MessageService
  ) {}

  selectedImage?: string;
  selectedFile?: File;
  showPolicies: boolean = false;
  isAccepted: boolean = false;
  isUploading: boolean = false;
  uploadProgress: number = 0;

  signup = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
      ]),
      birthDate: new FormControl('', [Validators.required, validBirthDate]),
      genre: new FormControl(null, [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_DOT_COM_REGEX),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(PERU_PHONE_REGEX),
      ]),
      acceptTerms: new FormControl(false, [Validators.requiredTrue]),
    },
    { validators: passwordMatchValidator }
  );

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

  showFieldError(controlName: string): boolean {
    const control = this.signup.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(controlName: string): string {
    const control = this.signup.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      if (controlName === 'acceptTerms') {
        return 'Debes aceptar los términos.';
      }
      return 'Este campo es obligatorio.';
    }
    if (control.hasError('pattern')) {
      if (controlName === 'email') return 'El correo debe terminar en .com';
      if (controlName === 'phoneNumber')
        return 'Ingresa un celular peruano válido (9 dígitos).';
      return 'Solo se permiten letras y espacios.';
    }
    if (control.hasError('minlength')) {
      return 'Mínimo 6 caracteres.';
    }
    if (control.hasError('invalidDate')) {
      return 'Ingresa una fecha válida anterior a hoy (dd/mm/aaaa).';
    }
    return '';
  }

  get passwordsDoNotMatch(): boolean {
    const confirmTouched = this.signup.get('confirmPassword');
    return (
      !!this.signup.errors?.['passwordMismatch'] &&
      !!(confirmTouched?.dirty || confirmTouched?.touched)
    );
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
              this.messageService.add({
                severity: 'success',
                summary: 'Imagen subida',
                detail: 'La imagen de tu perfil se ha subido correctamente.',
              });
              this.registerUser(response.secure_url, response.public_id);
            },
            error: (error) => {
              console.error('Error al subir imagen:', error);
              this.isUploading = false;
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
      birthDate: new Date(this.signup.value.birthDate!),
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
          this.messageService.add({
            severity: 'success',
            summary: 'Registro exitoso',
            detail: 'Tu cuenta ha sido creada correctamente.',
          });
          this.goToLogin();
        }
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Error al registrar usuario:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error en el registro',
          detail: error.error || 'Ocurrió un error al registrar el usuario.',
        });
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], {
      relativeTo: this.route,
    });
  }
}
