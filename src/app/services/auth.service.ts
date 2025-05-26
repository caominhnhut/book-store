import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Mock user để test
  private mockUser: User = {
    id: 1,
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phoneNumber: '0123456789',
    address: {
      street: '123 Đường ABC',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      postalCode: '70000',
      country: 'Việt Nam'
    },
    role: 'user' // Thêm role mới
  };

  // Thêm một mock user admin để test
  private mockAdminUser: User = {
    id: 2,
    fullName: 'Admin User',
    email: 'admin@example.com',
    phoneNumber: '0987654321',
    address: {
      street: '456 Đường XYZ',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 2',
      postalCode: '70000',
      country: 'Việt Nam'
    },
    role: 'admin'
  };

  constructor(private http: HttpClient) {
    // Try to initialize user from stored token
    this.initUser();
  }

  login(email: string, password: string): Observable<any> {
    console.log('Attempting login for email:', email);
    
    // Kết nối với API thực tế để đăng nhập
    return this.http.post<{data: string, error: any}>(`${this.apiUrl}/no-auth/authenticate`, {email, password})
      .pipe(
        tap(response => {
          console.log('Login response received:', response);
          
          if (response.data) {
            const token = response.data;
            this.setToken(token);
            
            // Extract user email from token if possible
            const decodedToken = this.decodeToken(token);
            console.log('Decoded token:', decodedToken);
            
            const tokenEmail = decodedToken?.sub || email; // 'sub' is the standard JWT field for subject (email)
            
            // Get user info using the email
            this.getUserInfoByEmail(tokenEmail).subscribe({
              next: (user) => console.log('User info loaded successfully'),
              error: (err) => console.error('Error loading user info:', err)
            });
          }
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }
  
  // Get user information by email
  private getUserInfoByEmail(email: string): Observable<User> {
    // Get the auth token
    const token = this.getToken();
    
    // Set up headers with HttpHeaders
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    console.log('Getting user info for email:', email);
    return this.http.get<User>(`${this.apiUrl}/users/by-email`, { 
      headers,
      params: { email }
    })
      .pipe(
        tap(user => {
          console.log('User info received:', user);
          this.setCurrentUser(user);
        }),
        catchError(error => {
          // If we can't fetch the user info, handle the error more gracefully
          console.error('Error fetching user info:', error);
          
          // For testing purposes only, create a fallback user based on email
          // In production, this should be removed
          const fallbackUser: User = {
            id: 999,
            fullName: email.split('@')[0],
            email: email,
            phoneNumber: '',
            role: email.includes('admin') ? 'admin' : 'user',
            address: {
              street: '',
              city: '',
              district: '',
              postalCode: '',
              country: ''
            }
          };
          
          console.log('Using fallback user:', fallbackUser);
          this.setCurrentUser(fallbackUser);
          return of(fallbackUser);
        })
      );
  }

  register(user: Partial<User>, password: string): Observable<any> {
    // Kết nối với API thực tế để đăng ký
    return this.http.post<{data: number, error: any}>(`${this.apiUrl}/no-auth/register`, {
      email: user.email,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      password
    }).pipe(
      tap(response => {
        if (response.data) {
          // After successful registration, show success message or redirect
          // User will need to verify email before logging in
          console.log('Registration successful! Please check your email to verify your account.');
          
          // We don't set token or current user here because the user needs to verify email first
          // Instead, we'll handle login after email verification
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    // Xóa token và thông tin người dùng
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return !!currentUser && currentUser.role === 'admin';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  updateProfile(user: Partial<User>): Observable<User> {
    // Connect to the actual API for profile updates
    return this.http.put<User>(`${this.apiUrl}/profile`, user)
      .pipe(
        tap(updatedUser => {
          this.setCurrentUser(updatedUser);
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  // Mock login với admin để test
  loginAsAdmin(): void {
    this.setToken('mock_admin_token');
    this.setCurrentUser(this.mockAdminUser);
  }

  // Mock login với user thường để test
  loginAsUser(): void {
    this.setToken('mock_user_token');
    this.setCurrentUser(this.mockUser);
  }

  // Method for email verification
  verifyEmail(token: string): Observable<any> {
    // Connect to the actual API for email verification
    return this.http.get<{success: boolean}>(`${this.apiUrl}/no-auth/verify-email?token=${token}`).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  // Decode JWT token to get user information
  private decodeToken(token: string): any {
    if (!token) {
      return null;
    }
    try {
      // JWT tokens are in format: header.payload.signature
      // We only need the payload part, which is the second segment
      const payload = token.split('.')[1];
      // The payload is base64 encoded, so we need to decode it
      const decodedPayload = atob(payload);
      // Convert the decoded payload to a JSON object
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Initialize user from stored token
  initUser(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      if (decodedToken && decodedToken.sub) {
        this.getUserInfoByEmail(decodedToken.sub).subscribe({
          error: () => this.logout() // If error, logout and clear token
        });
      } else {
        // Invalid token without email, clear it
        this.logout();
      }
    }
  }
}