import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  verifying = true;
  success = false;
  errorMessage = '';
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Get the token from the URL query parameters
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      } else {
        this.verifying = false;
        this.errorMessage = 'No verification token found';
      }
    });
  }

  verifyEmail(token: string): void {
    this.authService.verifyEmail(token).subscribe({
      next: (result) => {
        this.verifying = false;
        this.success = true;
      },
      error: (error) => {
        this.verifying = false;
        this.errorMessage = error.message || 'Verification failed. The token may be invalid or expired.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
