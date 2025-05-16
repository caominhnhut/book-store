import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { Book } from '../models/book';
import { Promotion, PromotionType } from '../models/promotion';
import { Category } from '../models/category';
import { environment } from '../../environments/environment';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`;
  private mockBooks: Book[] = [];

  // Dữ liệu mẫu phụ (giữ lại cho khớp với mã hiện tại)
  private oldMockBooks: Book[] = [
    // Sách tiếng Việt
    {
      id: 1,
      title: 'Không gia đình',
      author: 'Hector Malot',
      description: 'Không gia đình kể về cuộc đời Remi, một cậu bé không cha mẹ, phải đi theo một đoàn xiếc thú rong, cậu đã gặp những con người tốt bụng và xấu xa...',
      price: 120000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fiction',
      publishedDate: new Date('1878-01-01'),
      pages: 450,
      isbn: '9781234567897',
      inStock: 15,
      rating: 4.7,
      language: 'Tiếng Việt'
    },
    {
      id: 2,
      title: 'Đắc nhân tâm',
      author: 'Dale Carnegie',
      description: 'Đắc nhân tâm của Dale Carnegie là quyển sách duy nhất về thể loại self-help liên tục đứng đầu danh mục sách bán chạy nhất (best-selling Books) do báo The New York Times bình chọn suốt 10 năm liền.',
      price: 85000,
      imageUrl: 'assets/images/book-2.jpg',
      category: 'self-help',
      publishedDate: new Date('1936-10-01'),
      pages: 320,
      isbn: '9781234567890',
      inStock: 25,
      rating: 4.8,
      language: 'Tiếng Việt'
    },
    {
      id: 3,
      title: 'Tôi thấy hoa vàng trên cỏ xanh',
      author: 'Nguyễn Nhật Ánh',
      description: 'Tôi thấy hoa vàng trên cỏ xanh là một tiểu thuyết dành cho thanh thiếu niên của nhà văn Nguyễn Nhật Ánh, xuất bản lần đầu tại Việt Nam vào năm 2010.',
      price: 92000,
      imageUrl: 'assets/images/book-3.jpg',
      category: 'fiction',
      publishedDate: new Date('2010-12-01'),
      pages: 378,
      isbn: '9781234567891',
      inStock: 18,
      rating: 4.6,
      language: 'Tiếng Việt'
    },
    {
      id: 4,
      title: 'Dạy con làm giàu',
      author: 'Robert Kiyosaki',
      description: 'Dạy con làm giàu là một trong những cuốn sách về tài chính cá nhân hay nhất mọi thời đại, hướng dẫn những gì mà người giàu dạy con cái họ về tiền bạc.',
      price: 109000,
      imageUrl: 'assets/images/book-4.jpg',
      category: 'finance',
      publishedDate: new Date('1997-04-01'),
      pages: 336,
      isbn: '9781234567892',
      inStock: 22,
      rating: 4.5,
      language: 'Tiếng Việt'
    },
    
    // Sách tiếng Anh
    {
      id: 5,
      title: 'The Little Prince',
      author: 'Antoine de Saint-Exupéry',
      description: 'The Little Prince is a novella by French aristocrat, writer, and aviator Antoine de Saint-Exupéry.',
      price: 178000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fiction',
      publishedDate: new Date('1943-04-01'),
      pages: 160,
      isbn: '9781234567893',
      inStock: 30,
      rating: 4.9,
      language: 'English'
    },
    {
      id: 6,
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      description: 'The Alchemist is a novel by Brazilian author Paulo Coelho that was first published in 1988.',
      price: 169000,
      imageUrl: 'assets/images/book-2.jpg',
      category: 'fiction',
      publishedDate: new Date('1988-01-01'),
      pages: 224,
      isbn: '9781234567894',
      inStock: 27,
      rating: 4.7,
      language: 'English'
    },
    {
      id: 7,
      title: 'Atomic Habits',
      author: 'James Clear',
      description: 'Atomic Habits is the definitive guide to breaking bad behaviors and adopting good ones in four steps, showing you how small, incremental, everyday routines compound into massive, positive change over time.',
      price: 282000,
      imageUrl: 'assets/images/book-3.jpg',
      category: 'self-help',
      publishedDate: new Date('2018-10-16'),
      pages: 320,
      isbn: '9781234567895',
      inStock: 20,
      rating: 4.8,
      language: 'English'
    },
    {
      id: 8,
      title: 'Harry Potter and the Philosopher\'s Stone',
      author: 'J.K. Rowling',
      description: 'Harry Potter and the Philosopher\'s Stone is a fantasy novel written by British author J. K. Rowling.',
      price: 250000,
      imageUrl: 'assets/images/book-4.jpg',
      category: 'fantasy',
      publishedDate: new Date('1997-06-26'),
      pages: 320,
      isbn: '9781234567896',
      inStock: 35,
      rating: 4.8,
      language: 'English',
      isPartOfSeries: true,
      seriesName: 'Harry Potter',
      seriesTotal: 7,
      seriesPosition: 1
    },
    {
      id: 9,
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
      description: 'Harry Potter and the Chamber of Secrets is a fantasy novel written by British author J. K. Rowling and the second novel in the Harry Potter series.',
      price: 250000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('1998-07-02'),
      pages: 352,
      isbn: '9781234567897',
      inStock: 30,
      rating: 4.7,
      language: 'English',
      isPartOfSeries: true,
      seriesName: 'Harry Potter',
      seriesTotal: 7,
      seriesPosition: 2
    },
    {
      id: 10,
      title: 'Harry Potter and the Prisoner of Azkaban',
      author: 'J.K. Rowling',
      description: 'Harry Potter and the Prisoner of Azkaban is a fantasy novel written by British author J. K. Rowling and the third in the Harry Potter series.',
      price: 250000,
      imageUrl: 'assets/images/book-2.jpg',
      category: 'fantasy',
      publishedDate: new Date('1999-07-08'),
      pages: 435,
      isbn: '9781234567898',
      inStock: 25,
      rating: 4.9,
      language: 'English',
      isPartOfSeries: true,
      seriesName: 'Harry Potter',
      seriesTotal: 7,
      seriesPosition: 3
    },
    {
      id: 11,
      title: 'The Hunger Games',
      author: 'Suzanne Collins',
      description: 'The Hunger Games is a 2008 dystopian novel by the American writer Suzanne Collins.',
      price: 220000,
      imageUrl: 'assets/images/book-3.jpg',
      category: 'sci-fi',
      publishedDate: new Date('2008-09-14'),
      pages: 374,
      isbn: '9781234567899',
      inStock: 20,
      rating: 4.5,
      language: 'English',
      isPartOfSeries: true,
      seriesName: 'The Hunger Games',
      seriesTotal: 3,
      seriesPosition: 1
    },
    {
      id: 12,
      title: 'Catching Fire',
      author: 'Suzanne Collins',
      description: 'Catching Fire is a 2009 science fiction young adult novel by the American novelist Suzanne Collins, the second book in The Hunger Games trilogy.',
      price: 220000,
      imageUrl: 'assets/images/book-4.jpg',
      category: 'sci-fi',
      publishedDate: new Date('2009-09-01'),
      pages: 391,
      isbn: '9781234567900',
      inStock: 18,
      rating: 4.4,
      language: 'English',
      isPartOfSeries: true,
      seriesName: 'The Hunger Games',
      seriesTotal: 3,
      seriesPosition: 2
    },
    {
      id: 13,
      title: 'Educated',
      author: 'Tara Westover',
      description: 'Educated is a memoir by the American author Tara Westover, published by Random House in 2018.',
      price: 290000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'biography',
      publishedDate: new Date('2018-02-20'),
      pages: 334,
      isbn: '9781234567901',
      inStock: 15,
      rating: 4.7,
      language: 'English'
    },
    {
      id: 14,
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      description: 'Thinking, Fast and Slow is a best-selling book published in 2011 by Nobel Memorial Prize in Economic Sciences laureate Daniel Kahneman.',
      price: 310000,
      imageUrl: 'assets/images/book-2.jpg',
      category: 'psychology',
      publishedDate: new Date('2011-10-25'),
      pages: 499,
      isbn: '9781234567902',
      inStock: 12,
      rating: 4.6,
      language: 'English'
    },
    {
      id: 15,
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      author: 'J.R.R. Tolkien',
      description: 'The Fellowship of the Ring is the first of three volumes of the epic novel The Lord of the Rings by the English author J. R. R. Tolkien.',
      price: 280000,
      imageUrl: 'assets/images/book-3.jpg',
      category: 'fantasy',
      publishedDate: new Date('1954-07-29'),
      pages: 423,
      isbn: '9781234567903',
      inStock: 22,
      rating: 4.9,
      language: 'English',
      isPartOfSeries: true,
      seriesName: 'The Lord of the Rings',
      seriesTotal: 3,
      seriesPosition: 1
    },
    {
      id: 16,
      title: 'The Lord of the Rings: The Two Towers',
      author: 'J.R.R. Tolkien',
      description: 'The Two Towers is the second volume of J. R. R. Tolkien\'s high fantasy novel The Lord of the Rings.',
      price: 280000,
      imageUrl: 'assets/images/book-4.jpg',
      category: 'fantasy',
      publishedDate: new Date('1954-11-11'),
      pages: 352,
      isbn: '9781234567904',
      inStock: 20,
      rating: 4.8,
      language: 'English',
      isPartOfSeries: true,
      seriesName: 'The Lord of the Rings',
      seriesTotal: 3,
      seriesPosition: 2
    },
    {
      id: 17,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description: 'To Kill a Mockingbird is a novel by Harper Lee published in 1960. Instantly successful, it has become a classic of modern American literature.',
      price: 185000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'classic',
      publishedDate: new Date('1960-07-11'),
      pages: 281,
      isbn: '9781234567905',
      inStock: 25,
      rating: 4.8,
      language: 'English'
    },
    {
      id: 18,
      title: 'Sapiens: A Brief History of Humankind',
      author: 'Yuval Noah Harari',
      description: 'Sapiens: A Brief History of Humankind is a book by Yuval Noah Harari, first published in Hebrew in Israel in 2011.',
      price: 320000,
      imageUrl: 'assets/images/book-2.jpg',
      category: 'history',
      publishedDate: new Date('2011-01-01'),
      pages: 443,
      isbn: '9781234567906',
      inStock: 18,
      rating: 4.7,
      language: 'English'
    },
    {
      id: 19,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description: 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald.',
      price: 165000,
      imageUrl: 'assets/images/book-3.jpg',
      category: 'classic',
      publishedDate: new Date('1925-04-10'),
      pages: 180,
      isbn: '9781234567907',
      inStock: 30,
      rating: 4.4,
      language: 'English'
    },
    {
      id: 20,
      title: '1984',
      author: 'George Orwell',
      description: '1984 is a dystopian social science fiction novel by English novelist George Orwell.',
      price: 175000,
      imageUrl: 'assets/images/book-4.jpg',
      category: 'classic',
      publishedDate: new Date('1949-06-08'),
      pages: 328,
      isbn: '9781234567908',
      inStock: 28,
      rating: 4.7,
      language: 'English'
    }
  ];

  constructor(private http: HttpClient, private mockDataService: MockDataService) {
    // Khởi tạo dữ liệu sách từ MockDataService
    this.mockBooks = this.mockDataService.getMockBooks();
    // Thêm khuyến mãi cho sách
    this.addPromotionsToBooks();
  }

  // Lấy tất cả sách
  getBooks(page: number = 1, limit: number = 12): Observable<{ books: Book[], total: number }> {
    // Trong môi trường thực tế, sẽ kết nối với API
    // return this.http.get<{ books: Book[], total: number }>(this.apiUrl);
    
    // Dùng dữ liệu mẫu
    const startIndex = (page - 1) * limit;
    const paginatedBooks = this.mockBooks.slice(startIndex, startIndex + limit);
    return of({
      books: paginatedBooks,
      total: this.mockBooks.length
    });
  }

  // Lấy một cuốn sách theo ID
  getBookById(id: number): Observable<Book | undefined> {
    // Trong môi trường thực tế, sẽ gọi API
    // return this.http.get<Book>(`${this.apiUrl}/${id}`);
    
    // Mock data: Tìm sách theo ID
    const book = this.mockBooks.find(b => b.id === id);
    return of(book);
  }

  // Lấy sách theo danh mục
  getBooksByCategory(category: string, page: number = 1, limit: number = 12): Observable<{ books: Book[], total: number }> {
    if (category === 'all') {
      return this.getBooks(page, limit);
    }
    
    // Trong môi trường thực tế, sẽ gọi API
    // return this.http.get<{ books: Book[], total: number }>(`${this.apiUrl}/category/${category}?page=${page}&limit=${limit}`);
    
    // Mock data: Lọc sách theo category
    const filteredBooks = this.mockBooks.filter(book => book.category === category);
    const startIndex = (page - 1) * limit;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + limit);
    
    return of({
      books: paginatedBooks,
      total: filteredBooks.length
    });
  }

  // Lấy sách theo bộ sách
  getBooksBySeries(seriesName: string): Observable<Book[]> {
    // Trong môi trường thực tế, sẽ gọi API
    // return this.http.get<Book[]>(`${this.apiUrl}/series/${seriesName}`);
    
    // Mock data: Lọc sách theo tên bộ
    const seriesBooks = this.mockBooks.filter(book => 
      book.isPartOfSeries && 
      book.seriesName && 
      book.seriesName === seriesName
    );
    
    return of(seriesBooks);
  }

  // Lấy các danh mục
  getCategories(): Observable<Category[]> {
    // Tạo map để đếm số lượng sách trong mỗi danh mục
    const categoryCounts = new Map<string, number>();
    const categoryNames = new Map<string, string>();
    
    // Map tên tiếng Anh cho các danh mục
    const englishNames: {[key: string]: string} = {
      'fiction': 'Fiction',
      'self-help': 'Self-Help',
      'finance': 'Finance',
      'fantasy': 'Fantasy',
      'sci-fi': 'Science Fiction',
      'biography': 'Biography',
      'psychology': 'Psychology',
      'classic': 'Classic Literature',
      'history': 'History'
    };
    
    // Đếm số lượng sách trong mỗi danh mục
    this.mockBooks.forEach(book => {
      const count = categoryCounts.get(book.category) || 0;
      categoryCounts.set(book.category, count + 1);
      
      if (book.language === 'English') {
        categoryNames.set(book.category, englishNames[book.category] || book.category);
      } else {
        // Tên danh mục trong tiếng Việt (giữ nguyên nếu đã có)
        if (!categoryNames.has(book.category)) {
          categoryNames.set(book.category, this.getCategoryVietnameseName(book.category));
        }
      }
    });
    
    // Chuyển map thành mảng các đối tượng Category
    const categories: Category[] = Array.from(categoryCounts).map(([id, count]) => ({
      id,
      name: categoryNames.get(id) || id,
      count,
      englishName: englishNames[id]
    }));
    
    // Sắp xếp theo số lượng sách giảm dần
    return of(categories.sort((a, b) => b.count - a.count));
  }
  
  // Lấy tên tiếng Việt của danh mục
  private getCategoryVietnameseName(categoryId: string): string {
    const vietnameseNames: {[key: string]: string} = {
      'fiction': 'Tiểu thuyết',
      'self-help': 'Phát triển bản thân',
      'finance': 'Tài chính',
      'fantasy': 'Thần thoại',
      'sci-fi': 'Khoa học viễn tưởng',
      'biography': 'Tiểu sử',
      'psychology': 'Tâm lý học',
      'classic': 'Văn học kinh điển',
      'history': 'Lịch sử'
    };
    
    return vietnameseNames[categoryId] || categoryId;
  }

  // Lấy sách theo ngôn ngữ
  getBooksByLanguage(language: string): Observable<Book[]> {
    return of(this.mockBooks.filter(book => book.language === language));
  }

  // Phân trang sách
  getPaginatedBooks(category?: string, language?: string, page: number = 1, pageSize: number = 16): Observable<Book[]> {
    let filteredBooks = this.mockBooks;
    
    // Lọc theo danh mục nếu có
    if (category) {
      filteredBooks = filteredBooks.filter(book => book.category === category);
    }
    
    // Lọc theo ngôn ngữ nếu có
    if (language) {
      filteredBooks = filteredBooks.filter(book => book.language === language);
    }
    
    // Tính vị trí bắt đầu và kết thúc
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Trả về phần sách đã phân trang
    return of(filteredBooks.slice(startIndex, endIndex));
  }

  // Lấy tổng số sách (để tính số trang)
  getTotalBooks(category?: string, language?: string): Observable<number> {
    let filteredBooks = this.mockBooks;
    
    // Lọc theo danh mục nếu có
    if (category) {
      filteredBooks = filteredBooks.filter(book => book.category === category);
    }
    
    // Lọc theo ngôn ngữ nếu có
    if (language) {
      filteredBooks = filteredBooks.filter(book => book.language === language);
    }
    
    return of(filteredBooks.length);
  }
  
  // Lấy tất cả sách cho admin
  getAllBooks(): Observable<Book[]> {
    // Trong thực tế sẽ gọi API riêng cho admin với đầy đủ thông tin
    // Ở đây dùng mock data và thêm một số thông tin cần thiết cho admin
    const booksWithAdminInfo = this.mockBooks.map(book => {
      return {
        ...book,
        stock: book.inStock || 0,
        discount: Math.floor(Math.random() * 30), // Giả lập discount ngẫu nhiên 0-30%
        isPublished: true,
        categoryId: book.category
      };
    });
    
    return of(booksWithAdminInfo);
  }

  // Lấy danh sách sách mới (dựa trên ngày xuất bản)
  getNewBooks(limit: number = 4): Observable<Book[]> {
    // Sắp xếp theo ngày xuất bản mới nhất và giới hạn số lượng
    const sortedBooks = [...this.mockBooks]
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
      .slice(0, limit);
    
    return of(sortedBooks);
  }
  
  // Lấy danh sách sách bán chạy (dựa trên xếp hạng)
  getBestSellerBooks(limit: number = 4): Observable<Book[]> {
    // Sắp xếp theo xếp hạng cao nhất và giới hạn số lượng
    const sortedBooks = [...this.mockBooks]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
    
    return of(sortedBooks);
  }

  // Thêm khuyến mãi cho sách
  addPromotionsToBooks() {
    // Một số mẫu khuyến mãi để thêm vào sách
    const promotions: Promotion[] = [
      {
        id: 1,
        title: 'Giảm giá 20%',
        description: 'Giảm 20% cho khách hàng mua sách trong tháng 5',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-05-31'),
        type: PromotionType.PERCENT,
        value: 20
      },
      {
        id: 2,
        title: 'Giảm giá 50k',
        description: 'Giảm 50.000đ cho đơn hàng từ 200.000đ',
        startDate: new Date('2025-05-10'),
        endDate: new Date('2025-06-10'),
        type: PromotionType.FIXED,
        value: 50000
      },
      {
        id: 3,
        title: 'Mua 2 tặng 1',
        description: 'Khi mua 2 sách cùng bộ sẽ được tặng 1 sách',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-06-30'),
        type: PromotionType.BUNDLE,
        value: 1
      },
      {
        id: 4,
        title: 'Tặng bookmark',
        description: 'Tặng kèm bookmark cho mọi đơn hàng',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-05-20'),
        type: PromotionType.GIFT,
        value: 0
      }
    ];
    
    // Thêm khuyến mãi vào một số sách
    this.mockBooks.forEach(book => {
      // Thêm khuyến mãi cho sách có giá > 100.000đ
      if (book.price > 100000) {
        book.promotions = [promotions[0]]; // Giảm giá 20%
        
        // Tính giá sau khuyến mãi
        book.discount = 20; // 20%
      }
      
      // Thêm khuyến mãi cho sách trong bộ
      if (book.isPartOfSeries) {
        book.promotions = book.promotions || [];
        book.promotions.push(promotions[2]); // Mua 2 tặng 1
      }
      
      // Thêm khuyến mãi cho một số sách ngẫu nhiên
      if (book.id % 3 === 0) {
        book.promotions = book.promotions || [];
        book.promotions.push(promotions[3]); // Tặng bookmark
      }
    });
  }
}