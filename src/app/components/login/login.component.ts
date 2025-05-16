import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
    const username = this.f['username'].value;
    const password = this.f['password'].value;

    // For demo purposes - admin login with special credentials
    if (username === 'admin@bookstore.com' && password === 'admin123') {
      this.authService.loginAsAdmin();
      this.router.navigate(['/admin']);
      return;
    }

    // Regular login flow
    this.authService.login(username, password)
      .subscribe({
        next: (response) => {
          // Check if the user has admin role for admin login attempt
          if (this.isAdminLogin && response.user.role !== 'admin') {
            this.errorMessage = 'Bạn không có quyền truy cập trang quản trị.';
            this.loading = false;
            this.authService.logout();
            return;
          }

          // Navigate to returnUrl or appropriate page based on role
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        },
        error: err => {
          this.errorMessage = err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
          this.loading = false;
        }
      });
  }

  // Helper method for development/testing
  loginAsMockAdmin(): void {
    this.authService.loginAsAdmin();
    this.router.navigate(['/admin']);
  }
}
