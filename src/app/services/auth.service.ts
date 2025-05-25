import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Mock user để test
  private mockUser: User = {
    id: 1,
    firstName: 'Nguyễn',
    lastName: 'Văn A',
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
    firstName: 'Admin',
    lastName: 'User',
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
    // Khôi phục thông tin người dùng từ localStorage (nếu có)
    const savedUser = localStorage.getItem(this.userKey);
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<any> {
    // Trong môi trường thực tế, sẽ kết nối với API
    // return this.http.post<{token: string, user: User}>(`${this.apiUrl}/login`, {email, password})
    //   .pipe(
    //     tap(response => {
    //       this.setToken(response.token);
    //       this.setCurrentUser(response.user);
    //     }),
    //     catchError(error => {
    //       return throwError(error);
    //     })
    //   );

    // Giả lập đăng nhập thành công với dữ liệu mẫu
    if (email === 'nguyenvana@example.com' && password === 'password') {
      const response = {
        token: 'mock-jwt-token',
        user: this.mockUser
      };
      this.setToken(response.token);
      this.setCurrentUser(response.user);
      return of(response);
    } else {
      return throwError(() => new Error('Email hoặc mật khẩu không đúng'));
    }
  }

  register(user: Partial<User>, password: string): Observable<any> {
    // Trong môi trường thực tế, sẽ kết nối với API
    // return this.http.post<{token: string, user: User}>(`${this.apiUrl}/register`, {...user, password})
    //   .pipe(
    //     tap(response => {
    //       this.setToken(response.token);
    //       this.setCurrentUser(response.user);
    //     }),
    //     catchError(error => {
    //       return throwError(error);
    //     })
    //   );

    // Giả lập đăng ký thành công
    const newUser: User = {
      id: 2,
      firstName: user.firstName || 'Người dùng',
      lastName: user.lastName || 'Mới',
      email: user.email || 'user@example.com',
      phoneNumber: user.phoneNumber,
      address: user.address
    };

    const response = {
      token: 'mock-jwt-token',
      user: newUser
    };

    this.setToken(response.token);
    this.setCurrentUser(response.user);
    return of(response);
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
    // Trong môi trường thực tế, sẽ kết nối với API
    // return this.http.put<User>(`${this.apiUrl}/profile`, user)
    //   .pipe(
    //     tap(updatedUser => {
    //       this.setCurrentUser(updatedUser);
    //     })
    //   );

    // Giả lập cập nhật thông tin người dùng
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        ...user
      };
      this.setCurrentUser(updatedUser);
      return of(updatedUser);
    }
    return throwError(() => new Error('Không tìm thấy người dùng hiện tại'));
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
    // In a real environment, this would connect to the API
    // return this.http.get<{success: boolean}>(`${this.apiUrl}/verify-email?token=${token}`);
    
    // Mock verification success
    return of({ success: true }).pipe(
      delay(1500) // Simulate network delay
    );
  }
}