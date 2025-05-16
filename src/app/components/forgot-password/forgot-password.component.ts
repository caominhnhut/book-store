import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Initialize the form
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.forgotPasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Stop if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.f['email'].value;

    // Simulate sending password reset email
    setTimeout(() => {
      this.loading = false;
      this.successMessage = 'Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email hoặc tin nhắn của bạn.';
      this.forgotPasswordForm.reset();
      this.submitted = false;
    }, 1500);

    // In a real application, you would call the auth service
    // this.authService.forgotPassword(email)
    //   .subscribe({
    //     next: () => {
    //       this.loading = false;
    //       this.successMessage = 'Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email hoặc tin nhắn của bạn.';
    //       this.forgotPasswordForm.reset();
    //       this.submitted = false;
    //     },
    //     error: err => {
    //       this.errorMessage = err.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    //       this.loading = false;
    //     }
    //   });
  }
}
