import { computed, Injectable, signal } from '@angular/core';
import { AuthResponse, LoginDto, RegisterDto } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY  = 'auth_user';
  private apiUrl = environment.apiUrl;

   // Signal-based current user
  private _currentUser = signal<AuthResponse | null>(this.loadUser());

  // Public computed values
  currentUser  = this._currentUser.asReadonly();
  isLoggedIn   = computed(() => !!this._currentUser());
  isAdmin      = computed(() => this._currentUser()?.role === 'Admin');
  userFullName = computed(() => this._currentUser()?.fullName ?? '');
  cartCount    = signal<number>(0);   // updated by CartService

  constructor(private http: HttpClient, private router: Router) {}

  register(dto: RegisterDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, dto).pipe(
      tap(res => this.saveSession(res))
    );
  }

  login(dto: LoginDto) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, dto).pipe(
      tap(res => this.saveSession(res))
    );
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

   hasRole(role: string): boolean {
    return this._currentUser()?.role === role;
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res));
    this._currentUser.set(res);
  }

  private loadUser(): AuthResponse | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  
}
