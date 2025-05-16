import { Component, OnInit, OnDestroy } from '@angular/core';
import { PromotionService } from '../../services/promotion.service';
import { BookOfMonth, Promotion } from '../../models/promotion';
import { CartService } from '../../services/cart.service';
import { Book } from '../../models/book';
import { IBook } from '../../models/types';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit, OnDestroy {
  bookOfMonth: BookOfMonth | null = null;
  loading = true;
  error = false;
  remainingDays = 0;
  remainingHours = 0;
  remainingMinutes = 0;
  remainingSeconds = 0;
  countdownSubscription: Subscription | null = null;

  constructor(
    private promotionService: PromotionService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadBookOfMonth();
    // Bắt đầu đếm ngược khi component được khởi tạo
    this.startCountdownTimer();
  }

  ngOnDestroy(): void {
    // Hủy subscription khi component bị hủy để tránh memory leak
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  loadBookOfMonth(): void {
    this.loading = true;
    this.promotionService.getCurrentMonthBooks().subscribe({
      next: (data) => {
        this.bookOfMonth = data;
        this.loading = false;
        this.calculateTimeRemaining();
      },
      error: (err) => {
        console.error('Failed to load book of month promotion', err);
        this.loading = false;
        this.error = true;
      }
    });
  }

  startCountdownTimer(): void {
    // Cập nhật thời gian mỗi giây
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.calculateTimeRemaining();
    });
  }

  calculateTimeRemaining(): void {
    if (this.bookOfMonth) {
      const now = new Date();
      const endDate = new Date(this.bookOfMonth.endDate);
      
      // Kiểm tra nếu khuyến mãi đã kết thúc
      if (now > endDate) {
        this.remainingDays = 0;
        this.remainingHours = 0;
        this.remainingMinutes = 0;
        this.remainingSeconds = 0;
        return;
      }
      
      // Tính thời gian còn lại (milliseconds)
      const diffTime = Math.abs(endDate.getTime() - now.getTime());
      
      // Chuyển đổi sang các đơn vị thời gian
      this.remainingDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      this.remainingHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.remainingMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
      this.remainingSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    }
  }

  calculateDiscountedPrice(book: Book | IBook): number {
    if (this.bookOfMonth) {
      return this.promotionService.calculateDiscountedPrice(book.price, this.bookOfMonth);
    }
    return book.price;
  }

  addToCart(book: Book | IBook): void {
    // Thêm sách vào giỏ hàng với giá đã giảm
    const discountedPrice = this.calculateDiscountedPrice(book);
    
    // Xử lý nếu là IBook (từ bookOfMonth.books hoặc featuredBook)
    if (!('category' in book)) {
      // Bổ sung các trường cần thiết để chuyển IBook thành Book
      const bookAsBook: Book = {
        ...book,
        category: 'book-of-month',  // Gán loại mặc định
        publishedDate: new Date(),  // Gán ngày hiện tại
        pages: 0,                   // Gán giá trị mặc định
        isbn: 'N/A',                // Gán giá trị mặc định
        inStock: 1                  // Mặc định còn hàng
      };
      
      const bookWithDiscount = { 
        ...bookAsBook, 
        price: discountedPrice, 
        originalPrice: book.price 
      };
      
      this.cartService.addToCart(bookWithDiscount, 1);
    } else {
      // Trường hợp đã là Book
      const bookWithDiscount = { 
        ...book, 
        price: discountedPrice, 
        originalPrice: book.price 
      };
      
      this.cartService.addToCart(bookWithDiscount, 1);
    }
  }

  getDiscountPercent(): number {
    return this.bookOfMonth?.discountPercent || 0;
  }
}
