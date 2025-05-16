// src/app/services/promotion.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Promotion, BookOfMonth, PromotionType } from '../models/promotion';
import { BookService } from './book.service';
import { Book } from '../models/book';
import { IBook } from '../models/types';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private currentDate = new Date();
  
  constructor(private bookService: BookService) { }
  
  getCurrentMonthBooks(): Observable<BookOfMonth> {
    // Lấy tháng và năm hiện tại
    const currentMonth = this.currentDate.getMonth() + 1; // getMonth trả về 0-11
    const currentYear = this.currentDate.getFullYear();
    
    return new Observable<BookOfMonth>(observer => {
      // Lấy sách từ BookService
      this.bookService.getBooks(1, 100).subscribe({
        next: (response) => {
          const books = response.books;
          // Chọn ngẫu nhiên 5-10 cuốn sách cho khuyến mãi sách của tháng
          const shuffled = [...books].sort(() => 0.5 - Math.random());
          const selectedBooks = shuffled.slice(0, this.getRandomNumber(5, 10));
          
          // Tạo một cuốn sách nổi bật
          const featuredBook = selectedBooks[0];
          
          // Tạo promotion
          const bookOfMonth: BookOfMonth = {
            id: `bom-${currentMonth}-${currentYear}`,
            title: `Sách hay tháng ${currentMonth}/${currentYear}`,
            description: 'Những cuốn sách được tuyển chọn đặc biệt trong tháng với giá ưu đãi',
            startDate: new Date(currentYear, currentMonth - 1, 1), // Ngày đầu tháng
            endDate: new Date(currentYear, currentMonth, 0),      // Ngày cuối tháng
            discountPercent: 25, // Giảm giá 25%
            discountType: 'percentage',
            books: selectedBooks,
            isActive: true,
            month: currentMonth,
            year: currentYear,
            featuredBook: featuredBook,
            imageUrl: featuredBook.imageUrl,
            badges: ['Hot', 'Giới hạn'],
            type: PromotionType.PERCENT,
            value: 25
          };
          
          // Trả về kết quả sau một độ trễ giả lập (giống như API thực)
          setTimeout(() => {
            observer.next(bookOfMonth);
            observer.complete();
          }, 500);
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
  
  getAllPromotions(): Observable<Promotion[]> {
    // Ở đây bạn có thể thêm các loại khuyến mãi khác
    return of([]).pipe(delay(500)); // Mock data, trả về mảng rỗng
  }
  
  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Tính giá sau khi khuyến mãi
  calculateDiscountedPrice(price: number, promotion: Promotion): number {
    // Xử lý trường hợp promotion có discountType/discountPercent
    if (promotion.discountType === 'percentage' && promotion.discountPercent !== undefined) {
      return Math.round(price * (1 - promotion.discountPercent / 100));
    } else if (promotion.discountType === 'fixed' && promotion.discountPercent !== undefined) {
      return Math.max(0, Math.round(price - promotion.discountPercent));
    } 
    // Xử lý trường hợp promotion có type/value (mã cũ)
    else if (promotion.type === PromotionType.PERCENT && promotion.value !== undefined) {
      return Math.round(price * (1 - promotion.value / 100));
    } else if (promotion.type === PromotionType.FIXED && promotion.value !== undefined) {
      return Math.max(0, Math.round(price - promotion.value));
    }
    // Trường hợp không có thông tin giảm giá
    return price;
  }
  
  // Kiểm tra xem một cuốn sách có nằm trong khuyến mãi hiện tại không
  isBookInCurrentPromotion(bookId: number): Observable<boolean> {
    return this.getCurrentMonthBooks().pipe(
      map(bookOfMonth => {
        if (!bookOfMonth || !bookOfMonth.books) {
          return false;
        }
        
        // Kiểm tra trong danh sách sách khuyến mãi
        return bookOfMonth.books.some(book => book.id === bookId);
      })
    );
  }
  
  // Lấy thông tin khuyến mãi cho một cuốn sách cụ thể
  getPromotionForBook(bookId: number): Observable<Promotion | null> {
    return this.getAllPromotions().pipe(
      map(promotions => {
        // Lọc các khuyến mãi có chứa sách này
        const bookPromotions = promotions.filter(promotion => {
          if (!promotion.books) return false;
          return promotion.books.some(book => book.id === bookId);
        });
        
        // Trả về khuyến mãi đầu tiên tìm thấy, nếu có
        return bookPromotions.length > 0 ? bookPromotions[0] : null;
      })
    );
  }
}
