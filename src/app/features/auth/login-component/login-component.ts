import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login-component',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Signals for UI state
  isLoading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Helper to get individual controls cleanly in the template
  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }

  togglePassword() {
    this.showPassword.update((v) => !v);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // show all errors
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        const returnUrl =
          new URLSearchParams(window.location.search).get('returnUrl') || '/products';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Login failed. Try again.');
        this.isLoading.set(false);
      },
    });
  }
}
