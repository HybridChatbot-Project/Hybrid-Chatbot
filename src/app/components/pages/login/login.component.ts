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
import { RecaptchaModule } from 'ng-recaptcha';
import { environments } from '../../../../environments/environment';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';

const EMAIL_DOT_COM_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/i;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    PasswordModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  key = environments.site_key;
  captchaToken: string | null = null;
  captchaTouched = false;
  signin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_DOT_COM_REGEX)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.captchaTouched = true;

    if (this.signin.invalid || !this.captchaToken) {
      this.signin.markAllAsTouched();
      return;
    }

    if (this.signin.valid) {
      const formLogin = {
        email: this.signin.value.email!,
        password: this.signin.value.password!,
        recaptchaToken: this.captchaToken!,
      };
      this.authService.loginUser(formLogin).subscribe({
        next: (response) => {
          if (response.status_code === 200) {
            console.log('Inicio de sesión exitoso');

            const token = response.data!;
            localStorage.setItem('token', token);
            const decoded: any = jwtDecode(token);
            localStorage.setItem('userId', decoded.id);
            localStorage.setItem('userEmail', decoded.sub);
            localStorage.setItem('userFirstName', decoded.name);

            this.router.navigate(['/hybridchatbot/home']);
          }
        },
      });
    }
  }

  onCaptchaResolved(token: string | null) {
    this.captchaToken = token;
    this.captchaTouched = true;
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
    if (control.hasError('pattern')) {
      return 'El correo debe terminar en .com';
    }
    if (control.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}
