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
import { Router, RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ImageModule } from 'primeng/image';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { PrimeNGConfig } from 'primeng/api';

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
  selectedImage?: string;
  selectedFile?: File;
  showPolicies: boolean = false;
  isAccepted: boolean = false;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  showVerification: boolean = false;

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

  es = {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar',
  };

  constructor(
    private primengConfig: PrimeNGConfig,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.primengConfig.setTranslation(this.es);
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
      this.isUploading = false;
      this.showVerification = true;
    } else {
      this.signup.markAllAsTouched();
    }
  }

  goToLogin(): void {
    this.showVerification = false;
    this.router.navigate(['/auth/login']);
  }
}
