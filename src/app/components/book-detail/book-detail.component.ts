import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { PromotionService } from '../../services/promotion.service';
import { Promotion, PromotionType } from '../../models/promotion';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book: Book | undefined;
  relatedBooks: Book[] = [];
  seriesBooks: Book[] = [];
  loading: boolean = true;
  downloadProgress: number = 0;
  isDownloading: boolean = false;
  downloadingSeriesProgress: number = 0;
  isDownloadingSeries: boolean = false;
  
  // Thông tin khuyến mãi
  bookPromotion: Promotion | null = null;
  isBookOfMonth: boolean = false;
  discountedPrice: number = 0;
  
  // Quản lý việc tải xuống từng quyển sách
  downloadingBooks: Map<number, {isDownloading: boolean, progress: number}> = new Map();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private cartService: CartService,
    private promotionService: PromotionService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const bookId = params.get('id');
      if (bookId) {
        this.loadBookDetails(+bookId);
      } else {
        this.router.navigate(['/books']);
      }
    });
  }

  loadBookDetails(bookId: number): void {
    this.loading = true;
    this.bookService.getBookById(bookId).subscribe({
      next: (book) => {
        this.book = book;
        if (book) {
          this.findRelatedBooks(book);
          this.checkBookPromotions(book.id);
          // Nếu sách là một phần của bộ sách, tìm các sách khác trong cùng bộ
          if (book.isPartOfSeries && book.seriesName) {
            this.findSeriesBooks(book.seriesName, book.id);
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Lỗi khi tải sách:', error);
        this.loading = false;
        this.router.navigate(['/books']);
      }
    });
  }

  findRelatedBooks(book: Book): void {
    this.bookService.getBooksByCategory(book.category, 1, 5).subscribe({
      next: (data) => {
        // Lọc ra các sách khác và giới hạn số lượng hiển thị
        this.relatedBooks = data.books
          .filter(b => b.id !== book.id)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Lỗi khi tải sách liên quan:', error);
      }
    });
  }

  findSeriesBooks(seriesName: string, currentBookId: number): void {
    this.bookService.getBooksBySeries(seriesName).subscribe({
      next: (books) => {
        this.seriesBooks = books.filter(b => b.id !== currentBookId);
      },
      error: (error) => {
        console.error('Lỗi khi tải sách trong bộ:', error);
      }
    });
  }

  addToCart(book: Book): void {
    // Nếu sách đang trong khuyến mãi, thêm vào giỏ hàng với giá đã giảm
    if (this.bookPromotion && this.discountedPrice) {
      const bookWithDiscount = { 
        ...book, 
        price: this.discountedPrice,
        originalPrice: book.price // Lưu giá gốc để hiển thị trong giỏ hàng
      };
      this.cartService.addToCart(bookWithDiscount);
    } else {
      this.cartService.addToCart(book);
    }
  }

  downloadBook(book: Book): void {
    if (this.isDownloading) return;
    
    this.isDownloading = true;
    this.downloadProgress = 0;
    
    // Giả lập quá trình tải sách
    const interval = setInterval(() => {
      this.downloadProgress += 10;
      if (this.downloadProgress >= 100) {
        clearInterval(interval);
        this.isDownloading = false;
        this.downloadCompleted(book);
      }
    }, 300);
  }

  downloadAllSeriesBooks(): void {
    if (this.isDownloadingSeries || !this.book?.seriesName || this.seriesBooks.length === 0) return;
    
    this.isDownloadingSeries = true;
    this.downloadingSeriesProgress = 0;
    
    // Giả lập quá trình tải bộ sách
    const interval = setInterval(() => {
      this.downloadingSeriesProgress += 5;
      if (this.downloadingSeriesProgress >= 100) {
        clearInterval(interval);
        this.isDownloadingSeries = false;
        this.downloadSeriesCompleted();
      }
    }, 200);
  }
  
  isDownloadingBook(bookId: number): boolean {
    return this.downloadingBooks.get(bookId)?.isDownloading || false;
  }
  
  getDownloadProgress(bookId: number): number {
    return this.downloadingBooks.get(bookId)?.progress || 0;
  }
  
  downloadSingleSeriesBook(book: Book): void {
    if (this.isDownloadingBook(book.id)) return;
    
    // Thiết lập trạng thái ban đầu cho việc tải xuống
    this.downloadingBooks.set(book.id, {
      isDownloading: true,
      progress: 0
    });
    
    // Giả lập quá trình tải sách
    const interval = setInterval(() => {
      const currentStatus = this.downloadingBooks.get(book.id);
      if (currentStatus) {
        const newProgress = currentStatus.progress + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          this.downloadingBooks.set(book.id, {
            isDownloading: false,
            progress: 100
          });
          this.downloadSeriesBookCompleted(book);
        } else {
          this.downloadingBooks.set(book.id, {
            isDownloading: true,
            progress: newProgress
          });
        }
      }
    }, 300);
  }
  
  private downloadSeriesBookCompleted(book: Book): void {
    alert(`Sách "${book.title}" (Tập ${book.seriesPosition}) đã được tải xuống thành công!`);
  }

  private downloadCompleted(book: Book): void {
    alert(`Sách "${book.title}" đã được tải xuống thành công!`);
  }

  private downloadSeriesCompleted(): void {
    const seriesName = this.book?.seriesName || 'Bộ sách';
    const totalBooks = (this.book?.seriesTotal || 0) + ' cuốn';
    alert(`Đã tải xuống thành công toàn bộ ${seriesName} (${totalBooks})!`);
  }
  
  /**
   * Trả về lớp biểu tượng cho từng loại khuyến mãi
   */
  getPromotionIconClass(type: PromotionType | undefined): string {
    if (!type) return 'promotion-icon-default';
    
    switch(type) {
      case PromotionType.PERCENT:
        return 'promotion-icon-percent';
      case PromotionType.FIXED:
        return 'promotion-icon-fixed';
      case PromotionType.BUNDLE:
        return 'promotion-icon-bundle';
      case PromotionType.GIFT:
        return 'promotion-icon-gift';
      default:
        return 'promotion-icon-default';
    }
  }
  
  /**
   * Trả về biểu tượng FontAwesome cho từng loại khuyến mãi
   */
  getPromotionIcon(type: PromotionType | undefined): string {
    if (!type) return 'fas fa-tag';
    
    switch(type) {
      case PromotionType.PERCENT:
        return 'fas fa-percent';
      case PromotionType.FIXED:
        return 'fas fa-money-bill-wave';
      case PromotionType.BUNDLE:
        return 'fas fa-cubes';
      case PromotionType.GIFT:
        return 'fas fa-gift';
      default:
        return 'fas fa-tag';
    }
  }
  
  // Kiểm tra xem sách có nằm trong chương trình khuyến mãi nào không
  checkBookPromotions(bookId: number): void {
    // Kiểm tra xem sách có trong chương trình "Sách của tháng" không
    this.promotionService.isBookInCurrentPromotion(bookId).subscribe(isInPromotion => {
      this.isBookOfMonth = isInPromotion;
      
      if (isInPromotion && this.book) {
        // Lấy thông tin khuyến mãi hiện tại
        this.promotionService.getCurrentMonthBooks().subscribe(bookOfMonth => {
          this.bookPromotion = bookOfMonth;
          // Tính giá sau khuyến mãi
          this.calculateDiscountedPrice();
        });
      } else {
        // Kiểm tra xem sách có nằm trong khuyến mãi khác không
        this.promotionService.getPromotionForBook(bookId).subscribe(promotion => {
          this.bookPromotion = promotion;
          this.calculateDiscountedPrice();
        });
      }
    });
  }
  
  // Tính giá sau khuyến mãi
  calculateDiscountedPrice(): void {
    if (this.book && this.bookPromotion) {
      this.discountedPrice = this.promotionService.calculateDiscountedPrice(
        this.book.price, 
        this.bookPromotion
      );
    } else if (this.book) {
      this.discountedPrice = this.book.price;
    }
  }
}
