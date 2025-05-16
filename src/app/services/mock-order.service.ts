import { Injectable } from '@angular/core';
import { Order, OrderStatus, PaymentMethod } from '../models/order';
import { CartItem } from '../models/cart-item';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class MockOrderService {

  constructor(private mockDataService: MockDataService) { }
  
  /**
   * Tạo một đơn hàng mẫu từ giỏ hàng
   * @param cartItems Danh sách sản phẩm trong giỏ hàng
   * @param discountAmount Số tiền giảm giá (tùy chọn)
   * @param finalAmount Số tiền sau khi áp dụng giảm giá (tùy chọn)
   */
  createMockOrderFromCart(
    cartItems: CartItem[], 
    discountAmount: number = 0, 
    finalAmount?: number
  ): Order {
    const calculatedTotal = this.mockDataService.calculateTotalAmount(cartItems);
    
    return {
      id: this.generateOrderId(),
      userId: 1, // Giả định ID người dùng
      items: [...cartItems],
      totalAmount: finalAmount || calculatedTotal,
      discountAmount: discountAmount,
      orderDate: new Date(),
      status: OrderStatus.PENDING,
      shippingAddress: {
        street: '123 Đường Nguyễn Huệ',
        city: 'Hồ Chí Minh',
        district: 'Quận 1',
        postalCode: '70000',
        country: 'Việt Nam'
      },
      paymentMethod: PaymentMethod.CASH_ON_DELIVERY
    };
  }
  
  /**
   * Tạo một danh sách các đơn hàng mẫu
   */
  getMockOrders(): Order[] {
    const cartItems = this.mockDataService.getMockCartItems();
    const order1 = this.createMockOrderFromCart(cartItems);
    
    // Tạo thêm một đơn hàng thứ 2 với sản phẩm và trạng thái khác
    const books = this.mockDataService.getMockBooks();
    const orderItems2: CartItem[] = [
      { book: books[1], quantity: 1 },
      { book: books[3], quantity: 2 }
    ];
    
    const order2: Order = {
      ...this.createMockOrderFromCart(orderItems2),
      id: this.generateOrderId(),
      orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 ngày trước
      status: OrderStatus.DELIVERED,
      paymentMethod: PaymentMethod.BANK_TRANSFER
    };
    
    return [order1, order2];
  }
  
  /**
   * Tạo ID đơn hàng ngẫu nhiên
   */
  private generateOrderId(): number {
    return Math.floor(10000 + Math.random() * 90000);
  }
}
