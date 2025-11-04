import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RecaptchaModule } from 'ng-recaptcha';
import { environments } from '../../../../environments/environment';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    PasswordModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  key = environments.site_key;
  signin = new FormGroup({
    email: new FormControl(),
    password: new FormControl(),
  });

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if (this.signin.valid) {
      const formLogin = {
        email: this.signin.value.email!,
        password: this.signin.value.password!,
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
}
