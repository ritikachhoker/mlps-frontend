import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  login() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.getRawValue())
      .subscribe({

        next: (response: any) => {

          localStorage.setItem('token', response.data.token);

          localStorage.setItem(
            'admin',
            JSON.stringify(response.data.admin)
          );

          alert('Login Successful');

          this.router.navigate(['/admin/dashboard']);

        },

        error: (err) => {

          console.error(err);

          alert(err.error?.message || 'Login Failed');

        }

      });

  }

}