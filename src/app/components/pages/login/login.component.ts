import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  signin = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  onLogin(): void {
    if (this.signin.invalid) {
      this.signin.markAllAsTouched();
      return;
    }

    const identity = this.signin.value.email!.trim();
    const displayName = identity.includes('@')
      ? identity.split('@')[0]
      : identity;

    localStorage.setItem('token', 'demo-session');
    localStorage.setItem('userId', '1');
    localStorage.setItem('userEmail', identity);
    localStorage.setItem('userFirstName', displayName || 'Usuario');
    this.messageService.add({
      severity: 'success',
      summary: 'Inicio de sesión exitoso',
      detail: `¡Bienvenido, ${displayName || 'Usuario'}!`,
    });
    this.router.navigate(['/hybridchatbot/home']);
  }

  showFieldError(controlName: string): boolean {
    const control = this.signin.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  getErrorMessage(controlName: string): string {
    const control = this.signin.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    return '';
  }
}
