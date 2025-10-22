import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class SignUpComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  selectedImage?: string;
  showPolicies: boolean = false;
  isAccepted: boolean = false;

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
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
    if (this.signup.valid && this.isAccepted) {
      console.log('Formulario valido');
      this.router.navigate(['/hybridchatbot/home']);
    } else {
      console.log('El formulario no válido');
      this.router.navigate(['/hybridchatbot/home']);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login'], {
      relativeTo: this.route,
    });
  }
}
