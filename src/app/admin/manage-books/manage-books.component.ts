import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { BookService } from '../../services/book.service';
import { Category } from '../../models/category';

@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.scss']
})
export class ManageBooksComponent implements OnInit {
  books: any[] = [];
  filteredBooks: any[] = [];
  categories: any[] = [];
  
  // Filters
  searchTerm: string = '';
  categoryFilter: string = '';
  stockFilter: string = '';
  sortBy: string = 'title';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        // Thêm trạng thái cho mỗi sách để hiển thị
        this.books = books.map(book => ({
          ...book,
          status: this.getBookStatus(book)
        }));
        this.filterBooks();
      },
      error: (error) => console.error('Error loading books', error)
    });
  }

  loadCategories(): void {
    // Trong thực tế, bạn sẽ lấy danh sách danh mục từ service
    this.categories = [
      { id: 'fiction', name: 'Tiểu thuyết' },
      { id: 'business', name: 'Kinh tế & Kinh doanh' },
      { id: 'children', name: 'Sách thiếu nhi' },
      { id: 'science', name: 'Khoa học' },
      { id: 'biography', name: 'Tiểu sử & Hồi ký' },
      { id: 'selfhelp', name: 'Phát triển bản thân' }
    ];
  }

  filterBooks(): void {
    let filtered = [...this.books];

    // Lọc theo searchTerm
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(term) || 
        book.author.toLowerCase().includes(term)
      );
    }

    // Lọc theo danh mục
    if (this.categoryFilter) {
      filtered = filtered.filter(book => book.categoryId === this.categoryFilter);
    }

    // Lọc theo tồn kho
    if (this.stockFilter) {
      switch (this.stockFilter) {
        case 'low':
          filtered = filtered.filter(book => book.stock > 0 && book.stock <= 10);
          break;
        case 'out':
          filtered = filtered.filter(book => book.stock <= 0);
          break;
        case 'in':
          filtered = filtered.filter(book => book.stock > 10);
          break;
      }
    }

    // Sắp xếp
    if (this.sortBy) {
      const isDesc = this.sortBy.startsWith('-');
      const field = isDesc ? this.sortBy.substring(1) : this.sortBy;
      
      filtered.sort((a, b) => {
        let comparison = 0;
        if (a[field] > b[field]) {
          comparison = 1;
        } else if (a[field] < b[field]) {
          comparison = -1;
        }
        return isDesc ? -comparison : comparison;
      });
    }

    this.filteredBooks = filtered;
  }

  getBookStatus(book: any): string {
    if (!book.isPublished) return 'Bản thảo';
    if (book.stock <= 0) return 'Hết hàng';
    if (book.stock <= 10) return 'Sắp hết';
    return 'Còn hàng';
  }

  getStockStatusClass(stock: number): string {
    if (stock <= 0) return 'text-stock-out';
    if (stock <= 10) return 'text-stock-low';
    return 'text-stock-ok';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Còn hàng':
        return 'bg-success';
      case 'Sắp hết':
        return 'bg-warning';
      case 'Hết hàng':
        return 'bg-danger';
      case 'Bản thảo':
        return 'bg-secondary';
      default:
        return 'bg-info';
    }
  }

  openAddBookModal(): void {
    // Trong ứng dụng thực tế, bạn sẽ mở modal để thêm sách mới
    console.log('Add book modal should open');
    alert('Chức năng thêm sách sẽ được triển khai trong phiên bản tiếp theo.');
  }

  editBook(book: any): void {
    // Trong ứng dụng thực tế, bạn sẽ mở modal để chỉnh sửa sách
    console.log('Edit book:', book);
    alert(`Chỉnh sửa sách: ${book.title}`);
  }

  deleteBook(book: any): void {
    // Trong ứng dụng thực tế, bạn sẽ hiển thị confirm dialog
    if (confirm(`Bạn có chắc chắn muốn xóa sách "${book.title}"?`)) {
      console.log('Delete book:', book);
      // Xóa sách từ service
      // this.bookService.deleteBook(book.id).subscribe(...)
      
      // Cho demo, chỉ xóa khỏi mảng local
      this.books = this.books.filter(b => b.id !== book.id);
      this.filterBooks();
    }
  }

  viewBookDetails(book: any): void {
    // Trong ứng dụng thực tế, bạn sẽ mở trang chi tiết hoặc modal
    console.log('View book details:', book);
    alert(`Xem chi tiết sách: ${book.title}`);
  }
}
