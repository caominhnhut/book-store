import { Injectable } from '@angular/core';
import { Book } from '../models/book';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  
  private mockBooks: Book[] = [
    {
      id: 1,
      title: 'Đắc Nhân Tâm',
      author: 'Dale Carnegie',
      description: 'Đắc nhân tâm (How to Win Friends and Influence People) là một quyển sách nhằm tự giúp bản thân bán chạy nhất từ trước đến nay. Được xuất bản lần đầu vào năm 1936, quyển sách này đã bán được hơn 30 triệu bản trên khắp thế giới.',
      price: 120000,
      imageUrl: 'https://salt.tikicdn.com/cache/w400/ts/product/df/7d/da/d340edda2b0eacb7ddc47537cddb5e08.jpg',
      category: 'Kỹ năng sống',
      publishedDate: new Date('1936-10-01'),
      pages: 320,
      isbn: '978-604-0-01633-1',
      inStock: 50,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
      author: 'Rosie Nguyễn',
      description: 'Tuổi Trẻ Đáng Giá Bao Nhiêu là một tác phẩm truyền cảm hứng, cung cấp cho người đọc, đặc biệt là các bạn trẻ những kiến thức, kỹ năng để phát triển và hoàn thiện bản thân mình.',
      price: 80000,
      imageUrl: 'https://salt.tikicdn.com/cache/w400/ts/product/e4/9b/b7/a8fb939363ee073a3e87675ac7c66dbc.jpg',
      category: 'Kỹ năng sống',
      publishedDate: new Date('2016-02-24'),
      pages: 291,
      isbn: '978-604-1-01789-8',
      inStock: 30,
      rating: 4.5
    },
    {
      id: 3,
      title: 'Nhà Giả Kim',
      author: 'Paulo Coelho',
      description: 'Nhà giả kim (tên tiếng Bồ Đào Nha: O Alquimista) là tiểu thuyết được xuất bản lần đầu ở Brasil năm 1988, và đã được dịch ra 67 ngôn ngữ.',
      price: 65000,
      imageUrl: 'https://salt.tikicdn.com/cache/w400/ts/product/45/3b/fc/aa81d0a534b45706ae1eee1e344e80d9.jpg',
      category: 'Tiểu thuyết',
      publishedDate: new Date('1988-01-01'),
      pages: 224,
      isbn: '978-604-0-01822-9',
      inStock: 45,
      rating: 4.9
    },
    {
      id: 4,
      title: 'Không Gia Đình',
      author: 'Hector Malot',
      description: 'Không gia đình (tiếng Pháp: Sans famille) là một tiểu thuyết của nhà văn Hector Malot, được xuất bản năm 1878. Đây là một trong những tác phẩm văn học nổi tiếng nhất của Pháp.',
      price: 110000,
      imageUrl: 'https://salt.tikicdn.com/cache/w400/ts/product/3d/a3/71/60fef186ef843aa0bb69e36b7e31c969.jpg',
      category: 'Tiểu thuyết',
      publishedDate: new Date('1878-01-01'),
      pages: 386,
      isbn: '978-604-2-21418-5',
      inStock: 20,
      rating: 4.7
    },
    {
      id: 5,
      title: 'Người Giàu Có Nhất Thành Babylon',
      author: 'George S. Clason',
      description: 'Người giàu có nhất thành Babylon là một cuốn sách truyền cảm hứng về cách tiết kiệm, buôn bán và làm giàu.',
      price: 92000,
      imageUrl: 'https://salt.tikicdn.com/cache/w400/ts/product/22/cb/a9/524a27dcd45e8a13ae6eecb3dfacba7c.jpg',
      category: 'Kinh tế & Tài chính',
      publishedDate: new Date('1926-01-01'),
      pages: 208,
      isbn: '978-604-0-09239-7',
      inStock: 35,
      rating: 4.6
    }
  ];
  
  // Sách về thần thoại
  private mockMythologyBooks: Book[] = [
    {
      id: 101,
      title: 'Thần Thoại Bắc Âu',
      author: 'Neil Gaiman',
      description: 'Thần thoại Bắc Âu qua cách kể chuyện đầy sáng tạo của Neil Gaiman, tác giả của American Gods và Sandman. Một hành trình kỳ thú khám phá các vị thần như Odin, Thor, Loki và những câu chuyện về Ragnarok.',
      price: 185000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy', // 'fantasy' khớp với danh mục "Thần Thoại" trong BookService
      publishedDate: new Date('2019-03-05'),
      pages: 304,
      isbn: '978-604-0-05421-9',
      inStock: 25,
      rating: 4.7
    },
    {
      id: 102,
      title: 'Thần Thoại Hy Lạp',
      author: 'Edith Hamilton',
      description: 'Cuốn sách kinh điển về thần thoại Hy Lạp, kể về các vị thần trên đỉnh Olympus, các anh hùng và quái vật, cùng những câu chuyện bất tử đã truyền cảm hứng cho nền văn minh phương Tây.',
      price: 165000,
      imageUrl: 'assets/images/book-2.jpg',
      category: 'fantasy',
      publishedDate: new Date('2017-05-15'),
      pages: 382,
      isbn: '978-604-2-15327-8',
      inStock: 30,
      rating: 4.8
    },
    {
      id: 103,
      title: 'Thần Thoại Ai Cập',
      author: 'Garry J. Shaw',
      description: 'Khám phá thế giới thần bí của các vị thần Ai Cập cổ đại như Ra, Osiris, Isis, cùng với những câu chuyện về sự sáng tạo, cái chết và sự tái sinh trong nền văn hóa phong phú của đất nước kim tự tháp.',
      price: 195000,
      imageUrl: 'assets/images/book-3.jpg',
      category: 'fantasy',
      publishedDate: new Date('2018-11-20'),
      pages: 256,
      isbn: '978-604-1-09853-3',
      inStock: 20,
      rating: 4.5
    },
    {
      id: 104,
      title: 'Thần Thoại Ấn Độ',
      author: 'Devdutt Pattanaik',
      description: 'Khám phá kho tàng thần thoại phong phú từ tiểu lục địa Ấn Độ, với những câu chuyện về các vị thần như Vishnu, Shiva, và những sử thi vĩ đại Mahabharata, Ramayana.',
      price: 175000,
      imageUrl: 'assets/images/book-4.jpg',
      category: 'fantasy',
      publishedDate: new Date('2020-02-10'),
      pages: 330,
      isbn: '978-604-3-12456-2',
      inStock: 18,
      rating: 4.6
    },
    {
      id: 105,
      title: 'Thần Thoại Celtic',
      author: 'James MacKillop',
      description: 'Hành trình vào thế giới thần bí của người Celtic cổ đại, với những câu chuyện về các chiến binh huyền thoại, nữ thần và tiên tộc xuyên suốt vùng đất Ireland, Scotland và xứ Wales.',
      price: 155000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2019-07-08'),
      pages: 288,
      isbn: '978-604-2-18763-1',
      inStock: 15,
      rating: 4.3,
      isPartOfSeries: true,
      seriesName: "Thần Thoại Châu Âu",
      seriesTotal: 3,
      seriesPosition: 1
    },
    {
      id: 106,
      title: 'Thần Thoại Nhật Bản',
      author: 'Kazuko Nishimura',
      description: 'Những câu chuyện hấp dẫn về nữ thần mặt trời Amaterasu, quá trình sáng tạo ra quần đảo Nhật Bản, và các yêu quái yokai trong nền văn hóa phong phú của xứ sở hoa anh đào.',
      price: 168000,
      imageUrl: 'assets/images/book-2.jpg',
      category: 'fantasy',
      publishedDate: new Date('2021-03-15'),
      pages: 276,
      isbn: '978-604-0-25483-6',
      inStock: 22,
      rating: 4.7
    },
    {
      id: 107,
      title: 'Thần Thoại Maya và Aztec',
      author: 'Matt Clayton',
      description: 'Khám phá những câu chuyện huyền bí về các vị thần, nghi lễ hiến tế, và niềm tin về sự kết thúc của thời gian từ nền văn minh Maya và Aztec cổ đại ở Trung Mỹ.',
      price: 178000,
      imageUrl: 'assets/images/book-3.jpg',
      category: 'fantasy',
      publishedDate: new Date('2018-09-25'),
      pages: 264,
      isbn: '978-604-2-20185-7',
      inStock: 12,
      rating: 4.4
    },
    {
      id: 108,
      title: 'Thần Thoại Mesopotamia',
      author: 'Samuel Noah Kramer',
      description: 'Khám phá những câu chuyện thần thoại từ cái nôi của nền văn minh nhân loại - Lưỡng Hà, với các vị thần như Marduk, Gilgamesh và câu chuyện về trận Đại Hồng Thủy.',
      price: 182000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2017-11-30'),
      pages: 315,
      isbn: '978-604-1-15286-0',
      inStock: 16,
      rating: 4.5
    },
    {
      id: 109,
      title: 'Thần Thoại Bắc Âu: Ragnarok',
      author: 'Neil Gaiman',
      description: 'Tiếp nối cuốn sách đầu tiên về thần thoại Bắc Âu, tác giả tập trung vào câu chuyện về Ragnarok - tận thế của các vị thần và cuộc chiến cuối cùng giữa các thế lực thiện và ác.',
      price: 195000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2020-06-18'),
      pages: 328,
      isbn: '978-604-0-09876-2',
      inStock: 20,
      rating: 4.8,
      isPartOfSeries: true,
      seriesName: "Thần Thoại Bắc Âu",
      seriesTotal: 2,
      seriesPosition: 2
    },
    {
      id: 110,
      title: 'Thần Thoại Việt Nam',
      author: 'Nguyễn Đổng Chi',
      description: 'Tuyển tập những câu chuyện thần thoại đặc sắc của Việt Nam, từ Lạc Long Quân - Âu Cơ, Sơn Tinh - Thủy Tinh đến các truyền thuyết về An Dương Vương và những anh hùng dân tộc.',
      price: 145000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2019-02-03'),
      pages: 298,
      isbn: '978-604-2-17539-3',
      inStock: 35,
      rating: 4.9
    },
    {
      id: 111,
      title: 'Thần Thoại Châu Phi',
      author: 'Donna Rosenberg',
      description: 'Khám phá những câu chuyện thần thoại phong phú từ lục địa châu Phi, với những câu chuyện sáng tạo, các vị thần quyền năng và những con vật huyền bí từ nhiều nền văn hóa khác nhau.',
      price: 158000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2018-05-12'),
      pages: 252,
      isbn: '978-604-0-14329-9',
      inStock: 18,
      rating: 4.3
    },
    {
      id: 112,
      title: 'Thần Thoại Byzantine',
      author: 'Roger Pearse',
      description: 'Những câu chuyện thần thoại ít được biết đến từ Đế chế Byzantine, nơi giao thoa của văn hóa Hy Lạp, La Mã và Kitô giáo trong suốt hơn một thiên niên kỷ.',
      price: 172000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2021-01-20'),
      pages: 274,
      isbn: '978-604-2-22456-3',
      inStock: 14,
      rating: 4.2,
      isPartOfSeries: true,
      seriesName: "Thần Thoại Châu Âu",
      seriesTotal: 3,
      seriesPosition: 2
    },
    {
      id: 113,
      title: 'Quái Vật Trong Thần Thoại',
      author: 'John Boardman',
      description: 'Cuốn sách tổng hợp về các sinh vật và quái vật huyền thoại từ nhiều nền thần thoại trên thế giới, từ Chimera, Minotaur đến Rồng phương Đông và những sinh vật kỳ bí khác.',
      price: 187000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2020-08-14'),
      pages: 312,
      isbn: '978-604-0-19876-3',
      inStock: 20,
      rating: 4.6
    },
    {
      id: 114,
      title: 'Anh Hùng Trong Thần Thoại',
      author: 'Joseph Campbell',
      description: 'Phân tích chuyên sâu về mẫu hình người anh hùng trong thần thoại của các nền văn hóa khắp thế giới, với những hành trình mẫu mực và bài học vượt thời gian.',
      price: 198000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2017-07-22'),
      pages: 368,
      isbn: '978-604-1-23456-4',
      inStock: 15,
      rating: 4.8
    },
    {
      id: 115,
      title: 'Thần Thoại Slavic',
      author: 'Mark Yoffe',
      description: 'Khám phá thế giới thần thoại phong phú của người Slavic với các vị thần như Perun, Veles, và những sinh vật huyền bí như Baba Yaga, Rusalka trong nền văn hóa Đông Âu.',
      price: 163000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2019-10-05'),
      pages: 286,
      isbn: '978-604-2-25789-3',
      inStock: 17,
      rating: 4.4,
      isPartOfSeries: true,
      seriesName: "Thần Thoại Châu Âu",
      seriesTotal: 3,
      seriesPosition: 3
    },
    {
      id: 116,
      title: 'Thần Thoại Trung Hoa',
      author: 'Anne Birrell',
      description: 'Tuyển tập những câu chuyện thần thoại cổ đại của Trung Quốc, từ Bàn Cổ khai thiên lập địa, Nữ Oa vá trời đến Hậu Nghệ bắn rơi chín mặt trời.',
      price: 175000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2018-03-28'),
      pages: 308,
      isbn: '978-604-0-18765-2',
      inStock: 25,
      rating: 4.7
    },
    {
      id: 117,
      title: 'Thần Thoại Bắc Âu: Asgard',
      author: 'Neil Gaiman',
      description: 'Phần đầu tiên trong series thần thoại Bắc Âu, kể về vương quốc Asgard, nơi ở của các vị thần và những câu chuyện về nguồn gốc của thế giới trong văn hóa Vikings.',
      price: 185000,
      imageUrl: 'assets/images/book-1.jpg',
      category: 'fantasy',
      publishedDate: new Date('2017-02-07'),
      pages: 296,
      isbn: '978-604-0-12345-6',
      inStock: 22,
      rating: 4.9,
      isPartOfSeries: true,
      seriesName: "Thần Thoại Bắc Âu",
      seriesTotal: 2,
      seriesPosition: 1
    }
  ];

  constructor() { 
    // Thêm sách thần thoại vào danh sách sách chính
    this.mockBooks = [...this.mockBooks, ...this.mockMythologyBooks];
  }
  
  getMockBooks(): Book[] {
    return this.mockBooks;
  }
  
  getMythologyBooks(): Book[] {
    return this.mockMythologyBooks;
  }
  
  getMockCartItems(): CartItem[] {
    const books = this.getMockBooks();
    return [
      { book: books[0], quantity: 1 },
      { book: books[2], quantity: 2 },
      { book: books[4], quantity: 1 }
    ];
  }

  // Tính tổng tiền giỏ hàng
  calculateTotalAmount(cartItems: CartItem[]): number {
    return cartItems.reduce((total, item) => total + item.book.price * item.quantity, 0);
  }
}
