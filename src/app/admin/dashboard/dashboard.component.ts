import { Component, OnInit } from '@angular/core';

interface Order {
  id: number;
  customerName: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
}

interface TopBook {
  title: string;
  author: string;
  coverImage: string;
  sales: number;
  salesChange: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Stats data
  totalOrders = 0;
  totalUsers = 0;
  totalBooks = 0;
  monthlyRevenue = 0;
  
  // Calculated stats
  orderCompletionRate = 0;
  revenueChange = 0;
  revenueChangePercent = 0;
  newUsersPercent = 0;
  lowStockPercent = 0;
  
  // Sample data for display
  recentOrders: Order[] = [];
  topBooks: TopBook[] = [];

  constructor() {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Normally, you would fetch this data from your backend service
    // For now, we're using mock data
    
    // Stats
    this.totalOrders = 126;
    this.orderCompletionRate = 78;
    this.monthlyRevenue = 45600000; // 45.6 triệu VND
    this.revenueChange = 12.8;
    this.revenueChangePercent = 12.8;
    this.totalUsers = 258;
    this.newUsersPercent = 24;
    this.totalBooks = 432;
    this.lowStockPercent = 15;
    
    // Recent orders
    this.recentOrders = [
      { 
        id: 10458,
        customerName: 'Nguyễn Văn A',
        orderDate: new Date(2025, 4, 15), // May 15, 2025
        status: 'delivered',
        total: 850000
      },
      { 
        id: 10457,
        customerName: 'Trần Thị B',
        orderDate: new Date(2025, 4, 14), // May 14, 2025
        status: 'shipped',
        total: 520000
      },
      { 
        id: 10456,
        customerName: 'Lê Văn C',
        orderDate: new Date(2025, 4, 13), // May 13, 2025
        status: 'processing',
        total: 625000
      },
      { 
        id: 10455,
        customerName: 'Phạm Thị D',
        orderDate: new Date(2025, 4, 12), // May 12, 2025
        status: 'pending',
        total: 320000
      },
      { 
        id: 10454,
        customerName: 'Hoàng Văn E',
        orderDate: new Date(2025, 4, 10), // May 10, 2025
        status: 'cancelled',
        total: 450000
      }
    ];
    
    // Top books
    this.topBooks = [
      {
        title: 'Tiểu Thuyết Dòng Sông',
        author: 'Nguyễn Ngọc Tư',
        coverImage: 'assets/images/books/book-1.jpg',
        sales: 142,
        salesChange: 12
      },
      {
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        coverImage: 'assets/images/books/book-2.jpg',
        sales: 128,
        salesChange: 8
      },
      {
        title: 'Cà Phê Cùng Tony',
        author: 'Tony Buổi Sáng',
        coverImage: 'assets/images/books/book-3.jpg',
        sales: 97,
        salesChange: 5
      },
      {
        title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        coverImage: 'assets/images/books/book-4.jpg',
        sales: 89,
        salesChange: 15
      }
    ];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'processing':
        return 'badge-processing';
      case 'shipped':
        return 'badge-shipped';
      case 'delivered':
        return 'badge-delivered';
      case 'cancelled':
        return 'badge-cancelled';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  }
}
