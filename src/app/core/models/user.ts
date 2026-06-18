// core/models/user.model.ts
export interface User {
  userId:    number;
  email:     string;
  firstName: string;
  lastName:  string;
  role:      'Admin' | 'Customer';
}

export interface AuthResponse {
  token:     string;
  email:     string;
  fullName:  string;
  role:      string;
  expiresAt: string;
}

export interface LoginDto {
  email:    string;
  password: string;
}

export interface RegisterDto {
  email:       string;
  password:    string;
  firstName:   string;
  lastName:    string;
  phoneNumber?: string;
}