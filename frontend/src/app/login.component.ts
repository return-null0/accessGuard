import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        
        <div class="brand-header">
          <div class="logo-icon">🛡️</div>
          <h1>AccessGuard</h1>
          <p class="subtitle">Secure Gateway</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          
          <div *ngIf="errorMessage" class="error-banner">
            <span class="error-icon">⚠️</span> {{ errorMessage }}
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email" 
              placeholder="name@company.com"
              [class.invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
            >
            <small *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              Valid email is required
            </small>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              placeholder="••••••••"
              [class.invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            >
             <small *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              Minimum 6 characters
            </small>
          </div>

          <button type="submit" [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading" class="spinner"></span>
          </button>
          
        </form>
        
        <div class="footer">
          <p>Restricted Access System</p>
        </div>
      </div>
    </div>
  `,

  styleUrls: ['./app.component.css'] 
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = this.loginForm.value;
    
    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.isLoading = false;
        this.errorMessage = 'Invalid credentials provided.';
      }
    });
  }
}