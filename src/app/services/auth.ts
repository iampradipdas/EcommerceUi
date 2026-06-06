import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  login(data: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }
}
