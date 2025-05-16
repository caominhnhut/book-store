// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  newBooks: Book[] = [];
  bestSellerBooks: Book[] = [];
  categories: any[] = [
    {
      id: 'fiction',
      name: 'Tiểu thuyết',
      icon: 'fas fa-book',
      description: 'Các tác phẩm văn học, tiểu thuyết, truyện ngắn từ các tác giả nổi tiếng'
    },
    {
      id: 'business',
      name: 'Kinh tế & Kinh doanh',
      icon: 'fas fa-chart-line',
      description: 'Sách về quản trị, tài chính, marketing, khởi nghiệp và phát triển cá nhân'
    },
    {
      id: 'children',
      name: 'Sách thiếu nhi',
      icon: 'fas fa-child',
      description: 'Truyện tranh, sách tô màu, sách kỹ năng và kiến thức cho trẻ em'
    }
  ];

  constructor(
    private bookService: BookService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadNewBooks();
    this.loadBestSellerBooks();
  }

  loadNewBooks(): void {
    // Chỉ lấy 4 cuốn sách mới nhất
    this.bookService.getNewBooks(4).subscribe({
      next: (books) => this.newBooks = books,
      error: (error) => console.error('Error loading new books', error)
    });
  }

  loadBestSellerBooks(): void {
    // Chỉ lấy 4 cuốn sách bán chạy nhất
    this.bookService.getBestSellerBooks(4).subscribe({
      next: (books) => this.bestSellerBooks = books,
      error: (error) => console.error('Error loading bestseller books', error)
    });
  }

  addToCart(book: Book): void {
    this.cartService.addToCart(book, 1);
  }
}