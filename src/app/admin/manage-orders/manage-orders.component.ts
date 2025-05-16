import { Component, OnInit } from '@angular/core';

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: Date;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  items: Array<{
    id: number;
    bookId: number;
    title: string;
    price: number;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
}

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  // Filters
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = 'all';
  sortBy: string = '-orderDate';

  constructor() { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    // In a real app, you would fetch this from a service
    this.orders = [
      {
        id: 10458,
        customerName: 'Nguyễn Văn A',
        customerEmail: 'nguyenvana@example.com',
        orderDate: new Date(2025, 4, 15), // May 15, 2025
        total: 850000,
        status: 'delivered',
        paymentStatus: 'paid',
        items: [
          { id: 1, bookId: 2, title: 'Đắc nhân tâm', price: 85000, quantity: 2 },
          { id: 2, bookId: 5, title: 'Nhà giả kim', price: 680000, quantity: 1 }
        ],
        shippingAddress: {
          street: '123 Đường ABC',
          city: 'TP. Hồ Chí Minh',
          district: 'Quận 1',
          postalCode: '70000',
          country: 'Việt Nam'
        },
        paymentMethod: 'COD'
      },
      {
        id: 10457,
        customerName: 'Trần Thị B',
        customerEmail: 'tranthib@example.com',
        orderDate: new Date(2025, 4, 14), // May 14, 2025
        total: 520000,
        status: 'shipped',
        paymentStatus: 'paid',
        items: [
          { id: 1, bookId: 3, title: 'Cây cam ngọt của tôi', price: 120000, quantity: 1 },
          { id: 2, bookId: 6, title: 'Tôi thấy hoa vàng trên cỏ xanh', price: 400000, quantity: 1 }
        ],
        shippingAddress: {
          street: '456 Đường XYZ',
          city: 'Hà Nội',
          district: 'Đống Đa',
          postalCode: '10000',
          country: 'Việt Nam'
        },
        paymentMethod: 'ZaloPay'
      },
      {
        id: 10456,
        customerName: 'Lê Văn C',
        customerEmail: 'levanc@example.com',
        orderDate: new Date(2025, 4, 13), // May 13, 2025
        total: 625000,
        status: 'processing',
        paymentStatus: 'pending',
        items: [
          { id: 1, bookId: 1, title: 'Không gia đình', price: 120000, quantity: 1 },
          { id: 2, bookId: 8, title: 'Dế mèn phiêu lưu ký', price: 95000, quantity: 2 },
          { id: 3, bookId: 10, title: 'Số đỏ', price: 315000, quantity: 1 }
        ],
        shippingAddress: {
          street: '789 Đường MNO',
          city: 'Đà Nẵng',
          district: 'Hải Châu',
          postalCode: '50000',
          country: 'Việt Nam'
        },
        paymentMethod: 'Thẻ tín dụng'
      },
      {
        id: 10455,
        customerName: 'Phạm Thị D',
        customerEmail: 'phamthid@example.com',
        orderDate: new Date(2025, 4, 12), // May 12, 2025
        total: 320000,
        status: 'pending',
        paymentStatus: 'pending',
        items: [
          { id: 1, bookId: 4, title: 'Tôi là Bêtô', price: 150000, quantity: 1 },
          { id: 2, bookId: 7, title: 'Chí Phèo', price: 170000, quantity: 1 }
        ],
        shippingAddress: {
          street: '101 Đường PQR',
          city: 'Cần Thơ',
          district: 'Ninh Kiều',
          postalCode: '90000',
          country: 'Việt Nam'
        },
        paymentMethod: 'COD'
      },
      {
        id: 10454,
        customerName: 'Hoàng Văn E',
        customerEmail: 'hoangvane@example.com',
        orderDate: new Date(2025, 4, 10), // May 10, 2025
        total: 450000,
        status: 'cancelled',
        paymentStatus: 'refunded',
        items: [
          { id: 1, bookId: 9, title: 'Bố già', price: 450000, quantity: 1 }
        ],
        shippingAddress: {
          street: '202 Đường STU',
          city: 'Huế',
          district: 'Phú Nhuận',
          postalCode: '49000',
          country: 'Việt Nam'
        },
        paymentMethod: 'MoMo'
      }
    ];
    
    this.filterOrders();
  }

  filterOrders(): void {
    let filtered = [...this.orders];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toString().includes(term) || 
        order.customerName.toLowerCase().includes(term) ||
        order.customerEmail.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (this.statusFilter) {
      filtered = filtered.filter(order => order.status === this.statusFilter);
    }

    // Date filter
    const today = new Date();
    if (this.dateFilter !== 'all') {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        
        switch (this.dateFilter) {
          case 'today':
            return orderDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
          
          case 'yesterday':
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return orderDate.setHours(0, 0, 0, 0) === yesterday.setHours(0, 0, 0, 0);
          
          case 'week':
            const lastWeek = new Date(today);
            lastWeek.setDate(lastWeek.getDate() - 7);
            return orderDate >= lastWeek;
          
          case 'month':
            const lastMonth = new Date(today);
            lastMonth.setDate(lastMonth.getDate() - 30);
            return orderDate >= lastMonth;
          
          default:
            return true;
        }
      });
    }

    // Sort
    if (this.sortBy) {
      const isDesc = this.sortBy.startsWith('-');
      const field = isDesc ? this.sortBy.substring(1) : this.sortBy;
      
      filtered.sort((a: any, b: any) => {
        let comparison = 0;
        if (a[field] > b[field]) {
          comparison = 1;
        } else if (a[field] < b[field]) {
          comparison = -1;
        }
        return isDesc ? -comparison : comparison;
      });
    }

    this.filteredOrders = filtered;
  }

  getOrderStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }

  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'badge-pending';
      case 'processing': return 'badge-processing';
      case 'shipped': return 'badge-shipped';
      case 'delivered': return 'badge-delivered';
      case 'cancelled': return 'badge-cancelled';
      default: return '';
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chưa thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'paid': return 'payment-paid';
      case 'pending': return 'payment-pending';
      case 'failed': return 'payment-failed';
      case 'refunded': return 'payment-refunded';
      default: return '';
    }
  }

  updateOrderStatus(order: Order, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): void {
    // In a real application, you would call a service
    order.status = status;
    // Update payment status automatically based on order status
    if (status === 'delivered' && order.paymentStatus === 'pending') {
      order.paymentStatus = 'paid';
    } else if (status === 'cancelled' && order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }
    
    console.log(`Order #${order.id} status updated to ${status}`);
  }

  viewOrderDetails(order: Order): void {
    // In a real application, this would open a modal or navigate to a details page
    console.log('View order details:', order);
    alert(`Chi tiết đơn hàng #${order.id} - ${order.customerName}`);
  }
}
