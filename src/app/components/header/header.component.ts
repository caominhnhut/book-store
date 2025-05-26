import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 0;
  isLoggedIn: boolean = false;
  userName: string = '';
  isScrolled: boolean = false;
  
  // Language options
  languages = [
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];
  currentLanguage = this.languages[0]; // Default to Vietnamese
  
  // Listen for window scroll events
  @HostListener('window:scroll')
  onWindowScroll() {
    // Consider the header "scrolled" when the page is scrolled down more than 50px
    this.isScrolled = window.scrollY > 50;
  }

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Đăng ký theo dõi số lượng sản phẩm trong giỏ hàng
    this.cartService.cartItems$.subscribe(items => {
      this.cartItemCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    // Đăng ký theo dõi trạng thái đăng nhập
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.userName = user.fullName;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  
  changeLanguage(language: any): void {
    this.currentLanguage = language;
    // Here you would typically call a language service to change the app's language
    // For now we're just updating the UI state
    console.log(`Language changed to: ${language.name}`);
  }
}