import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../models/book';
import { Category } from '../../models/category';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  categories: (Category & { selected?: boolean })[] = [];
  selectedCategory: string | null = null;
  selectedCategoryName: string = 'Tất cả sách';
  selectedCategories: string[] = [];
  
  // Phân trang
  currentPage: number = 1;
  pageSize: number = 16;
  totalBooks: number = 0;
  totalAllBooks: number = 0; // Tổng số sách của tất cả các danh mục
  
  // Không còn phân loại theo ngôn ngữ
  
  loading: boolean = false;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Load các danh mục
    this.loadCategories();
    
    // Theo dõi tham số từ URL
    this.route.paramMap.subscribe(params => {
      const category = params.get('category');
      if (category) {
        this.selectedCategory = category;
        this.loadBooks();
      } else {
        // Nếu không có danh mục được chọn:
        // 1. Đầu tiên load tất cả sách
        this.selectedCategory = null;
        this.loadBooks();
        
        // 2. Sau đó load xong các danh mục thì sẽ chọn danh mục đầu tiên (nếu có)
        this.bookService.getCategories().subscribe(categories => {
          if (categories && categories.length > 0) {
            // Chọn danh mục đầu tiên làm mặc định
            this.selectCategory(categories[0].id);
          }
        });
      }
    });
  }

  loadCategories(): void {
    this.bookService.getCategories().subscribe(categories => {
      // Thêm thuộc tính selected vào mỗi danh mục
      this.categories = categories.map(category => ({
        ...category,
        selected: false
      }));
      
      // Tính tổng số sách từ tất cả các danh mục để hiển thị ở tiêu đề "Danh mục sách"
      this.totalAllBooks = this.categories.reduce((total, category) => total + category.count, 0);
    });
  }

  loadBooks(): void {
    this.loading = true;
    
    // Cập nhật tên danh mục được chọn
    if (this.selectedCategory) {
      const selectedCat = this.categories.find(cat => cat.id === this.selectedCategory);
      if (selectedCat) {
        this.selectedCategoryName = this.getVietnameseCategoryName(selectedCat);
      }
    } else {
      this.selectedCategoryName = 'Sách';
    }
    
    // Lấy tổng số sách để tính phân trang
    this.bookService.getTotalBooks(
      this.selectedCategory || undefined
    ).subscribe(total => {
      this.totalBooks = total;
      
      // Tải sách theo trang
      this.bookService.getPaginatedBooks(
        this.selectedCategory || undefined,
        undefined,
        this.currentPage, 
        this.pageSize
      ).subscribe(books => {
        this.books = books;
        this.loading = false;
      });
    });
  }

  selectCategory(categoryId: string): void {
    if (this.selectedCategory !== categoryId) {
      this.selectedCategory = categoryId;
      this.currentPage = 1; // Reset về trang đầu tiên khi chuyển danh mục
      
      // Cập nhật URL
      this.router.navigate(['/books', categoryId]);
      
      // Load sách mới
      this.loadBooks();
    }
  }
  
  /**
   * Xử lý khi người dùng chọn/bỏ chọn một danh mục
   */
  toggleCategorySelection(category: Category & { selected?: boolean }): void {
    category.selected = !category.selected;
    
    // Cập nhật danh sách các danh mục được chọn
    this.updateSelectedCategories();
    
    // Tải lại sách dựa trên các danh mục đã chọn
    this.loadFilteredBooks();
  }
  
  /**
   * Cập nhật danh sách các danh mục đã chọn
   */
  updateSelectedCategories(): void {
    this.selectedCategories = this.categories
      .filter(category => category.selected)
      .map(category => category.id);
      
    // Nếu không có danh mục nào được chọn, hiển thị tất cả sách
    if (this.selectedCategories.length === 0) {
      this.selectedCategoryName = 'Tất cả sách';
    } else if (this.selectedCategories.length === 1) {
      // Chỉ chọn 1 danh mục
      const selectedCat = this.categories.find(c => c.id === this.selectedCategories[0]);
      if (selectedCat) {
        this.selectedCategoryName = this.getVietnameseCategoryName(selectedCat);
      }
    } else {
      // Nhiều danh mục được chọn
      this.selectedCategoryName = `Sách theo ${this.selectedCategories.length} danh mục`;
    }
  }
  
  /**
   * Xóa tất cả các bộ lọc đã chọn
   */
  resetFilters(): void {
    // Đặt lại trạng thái selected cho tất cả các danh mục
    this.categories.forEach(category => category.selected = false);
    this.selectedCategories = [];
    this.selectedCategoryName = 'Tất cả sách';
    
    // Tải lại tất cả sách
    this.currentPage = 1;
    this.loadBooks();
  }
  
  /**
   * Tải sách dựa trên các danh mục được chọn
   */
  loadFilteredBooks(): void {
    this.loading = true;
    
    // Nếu không có danh mục nào được chọn, hiển thị tất cả sách
    if (this.selectedCategories.length === 0) {
      this.loadBooks();
      return;
    }
    
    // Lấy tổng số sách (chưa xử lý filter nhiều danh mục)
    this.bookService.getTotalBooks().subscribe(total => {
      this.bookService.getPaginatedBooks(
        undefined,
        undefined,
        this.currentPage, 
        this.pageSize
      ).subscribe(allBooks => {
        // Filter sách theo các danh mục đã chọn
        this.books = allBooks.filter(book => 
          this.selectedCategories.includes(book.category)
        );
        this.totalBooks = this.books.length;
        this.loading = false;
      });
    });
  }

  // Hàm này có thể được giữ lại để sử dụng trong tương lai nếu cần
  // hoặc để xử lý sự kiện từ các phần khác của ứng dụng
  showAllBooks(): void {
    // Lấy danh mục đầu tiên làm mặc định
    this.bookService.getCategories().subscribe(categories => {
      if (categories && categories.length > 0) {
        this.selectCategory(categories[0].id);
      } else {
        // Nếu không có danh mục nào, hiển thị tất cả sách
        this.selectedCategory = null;
        this.selectedCategoryName = 'Sách';
        this.currentPage = 1;
        
        // Cập nhật URL
        this.router.navigate(['/books']);
        
        // Load tất cả sách
        this.loadBooks();
      }
    });
  }

  // Đã loại bỏ hàm changeLanguage vì không cần phân loại theo ngôn ngữ nữa

  loadMore(): void {
    if (this.currentPage * this.pageSize < this.totalBooks) {
      this.currentPage++;
      
      this.loading = true;
      // Load thêm sách từ trang tiếp theo và thêm vào danh sách hiện có
      this.bookService.getPaginatedBooks(
        this.selectedCategory || undefined, 
        undefined, // Không phân loại theo ngôn ngữ
        this.currentPage, 
        this.pageSize
      ).subscribe(moreBooks => {
        this.books = [...this.books, ...moreBooks];
        this.loading = false;
      });
    }
  }

  hasMoreBooks(): boolean {
    return this.currentPage * this.pageSize < this.totalBooks;
  }

  addToCart(book: Book): void {
    this.cartService.addToCart(book);
  }

  // Lấy tên tiếng Việt cho danh mục
  getVietnameseCategoryName(category: Category): string {
    // Luôn sử dụng tên tiếng Việt
    // Dictionary các tên danh mục tiếng Việt
    const vietnameseNames: {[key: string]: string} = {
      'fiction': 'Tiểu thuyết',
      'self-help': 'Phát triển bản thân',
      'finance': 'Tài chính',
      'fantasy': 'Thần thoại',
      'sci-fi': 'Khoa học viễn tưởng',
      'biography': 'Tiểu sử',
      'psychology': 'Tâm lý học',
      'classic': 'Văn học kinh điển',
      'history': 'Lịch sử',
      'business': 'Kinh doanh',
      'children': 'Sách thiếu nhi'
    };
    return vietnameseNames[category.id] || category.name;
  }
}
