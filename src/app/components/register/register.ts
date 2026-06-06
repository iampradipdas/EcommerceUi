import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

/** Custom cross-field validator: confirmPassword must match password */
export const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authservice = inject(Auth);

  /** Toggle visibility of password fields */
  showPassword = false;
  showConfirmPassword = false;

  /** Track whether the form was submitted (to show all errors at once) */
  submitted = false;

  registerForm = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator },
  );

  // ── Convenience getters for use in the template ──────────────────────────

  get firstName() {
    return this.registerForm.get('firstName')!;
  }
  get lastName() {
    return this.registerForm.get('lastName')!;
  }
  get email() {
    return this.registerForm.get('email')!;
  }
  get username() {
    return this.registerForm.get('username')!;
  }
  get password() {
    return this.registerForm.get('password')!;
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword')!;
  }

  /** Returns true when a field should show its error messages */
  isInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty || this.submitted);
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.authservice.register(this.registerForm.value).subscribe({
        next: (response) => console.log('Registration successful:', response),
        error: (error) => console.error('Registration failed:', error),
      });
    }
  }
}
