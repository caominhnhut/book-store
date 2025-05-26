import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  showPassword = false;
  returnUrl: string = '/';
  isAdminLogin: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Initialize the login form
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Check if this is an admin login attempt
    this.isAdminLogin = this.returnUrl.includes('/admin');

    // If user is already logged in, redirect appropriately
    if (this.authService.isAuthenticated()) {
      if (this.isAdminLogin && this.authService.isAdmin()) {
        this.router.navigate(['/admin']);
      } else if (!this.isAdminLogin) {
        this.router.navigate(['/']);
      }
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.f['username'].value; // Using the form field value as email
    const password = this.f['password'].value;

    console.log('Login attempt with email:', email);

    // For demo purposes - admin login with special credentials
    if (email === 'admin@bookstore.com' && password === 'admin123') {
      console.log('Admin login detected, using mock admin user');
      this.authService.loginAsAdmin();
      this.router.navigate(['/admin']);
      this.loading = false;
      return;
    }

    // For demo purposes - regular user login with special credentials
    if (email === 'user@bookstore.com' && password === 'user123') {
      console.log('User login detected, using mock regular user');
      this.authService.loginAsUser();
      this.router.navigate([this.returnUrl]);
      this.loading = false;
      return;
    }

    // Regular login flow
    this.authService.login(email, password)
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          
          // Get the current user
          const currentUser = this.authService.getCurrentUser();
          
          // Check if the user has admin role for admin login attempt
          if (this.isAdminLogin && currentUser?.role !== 'admin') {
            this.errorMessage = 'Bạn không có quyền truy cập trang quản trị.';
            this.loading = false;
            this.authService.logout();
            return;
          }

          // Navigate to returnUrl or appropriate page based on role
          if (currentUser?.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
          
          this.loading = false;
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
          this.loading = false;
        }
      });
  }

  // Helper method for development/testing
  loginAsMockAdmin(): void {
    console.log('Using mock admin login');
    this.authService.loginAsAdmin();
    this.router.navigate(['/admin']);
  }

  // Helper method for development/testing
  loginAsMockUser(): void {
    console.log('Using mock user login');
    this.authService.loginAsUser();
    this.router.navigate(['/']);
  }
}
