import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  authservice = inject(Auth);

  registerForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      this.authservice.register(this.registerForm.value).subscribe({
        next: (response) => console.log('Registration successful:', response),
        error: (error) => console.error('Registration failed:', error),
      });
    }
  }
}
