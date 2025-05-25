import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize the registration form
    this.registerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,11}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, {
      validator: this.mustMatch('password', 'confirmPassword')
    });

    // If user is already logged in, redirect to home
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  // Custom validator to check if two form fields match
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    // Split the full name into first name and last name for compatibility
    const fullNameParts = this.f['fullName'].value.split(' ');
    const lastName = fullNameParts.slice(0, -1).join(' ') || fullNameParts[0]; // Everything except the last part, or the only part if just one word
    const firstName = fullNameParts.length > 1 ? fullNameParts[fullNameParts.length - 1] : ''; // Last part, or empty if just one word

    const user = {
      firstName: firstName,
      lastName: lastName,
      email: this.f['email'].value,
      phoneNumber: this.f['phoneNumber'].value
    };

    const password = this.f['password'].value;

    this.authService.register(user, password)
      .subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản.';
          this.registerForm.reset();
          this.submitted = false;
        },
        error: err => {
          this.errorMessage = err.message || 'Đăng ký thất bại. Vui lòng thử lại.';
          this.loading = false;
        }
      });
  }
}
