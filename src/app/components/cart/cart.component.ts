import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MockDataService } from '../../services/mock-data.service';
import { MockOrderService } from '../../services/mock-order.service';
import { CartItem } from '../../models/cart-item';
import { Order } from '../../models/order';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  discountAmount: number = 0; // Thêm giá trị khuyến mãi
  finalAmount: number = 0; // Số tiền sau khi trừ khuyến mãi
  useMockData: boolean = true; // Toggle for using mock data
  mockOrder: Order | null = null; // Lưu đơn hàng mẫu

  constructor(
    private cartService: CartService,
    private mockDataService: MockDataService,
    private mockOrderService: MockOrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Kiểm tra nếu dùng mock data
    if (this.useMockData) {
      this.loadMockData();
    } else {
      this.loadCartItems();
      this.cartService.cartItems$.subscribe(() => {
        this.loadCartItems();
      });
    }
  }

  loadMockData(): void {
    this.cartItems = this.mockDataService.getMockCartItems();
    this.totalAmount = this.mockDataService.calculateTotalAmount(this.cartItems);
    this.calculateDiscount();
    console.log('Mock data loaded:', this.cartItems);
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartService.getTotalAmount();
    this.calculateDiscount();
  }
  
  calculateDiscount(): void {
    // Tính khuyến mãi (10% cho đơn hàng trên 200.000đ)
    this.discountAmount = this.totalAmount > 200000 ? Math.round(this.totalAmount * 0.1) : 0;
    this.finalAmount = this.totalAmount - this.discountAmount;
  }

  updateQuantity(bookId: number, quantity: number): void {
    if (this.useMockData) {
      // Cập nhật số lượng trong mock data
      const itemIndex = this.cartItems.findIndex(item => item.book.id === bookId);
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Xóa sản phẩm khỏi giỏ hàng nếu số lượng <= 0
          this.cartItems.splice(itemIndex, 1);
        } else {
          // Cập nhật số lượng
          this.cartItems[itemIndex].quantity = quantity;
        }
        // Tính lại tổng tiền
        this.totalAmount = this.mockDataService.calculateTotalAmount(this.cartItems);
        this.calculateDiscount();
      }
    } else {
      this.cartService.updateQuantity(bookId, quantity);
    }
  }

  removeItem(bookId: number): void {
    if (this.useMockData) {
      // Xóa sản phẩm khỏi mock data
      this.cartItems = this.cartItems.filter(item => item.book.id !== bookId);
      // Tính lại tổng tiền
      this.totalAmount = this.mockDataService.calculateTotalAmount(this.cartItems);
      this.calculateDiscount();
    } else {
      this.cartService.removeFromCart(bookId);
    }
  }

  clearCart(): void {
    if (this.useMockData) {
      // Xóa toàn bộ giỏ hàng mock data
      this.cartItems = [];
      this.totalAmount = 0;
      this.discountAmount = 0;
      this.finalAmount = 0;
    } else {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    if (this.useMockData && this.cartItems.length > 0) {
      // Tạo đơn hàng mẫu từ giỏ hàng hiện tại và truyền giá trị giảm giá
      this.mockOrder = this.mockOrderService.createMockOrderFromCart(
        this.cartItems, 
        this.discountAmount,
        this.finalAmount
      );
      console.log('Đã tạo đơn hàng mẫu:', this.mockOrder);
      
      // Chuyển đến trang thanh toán
      this.router.navigate(['/checkout']);
    } else {
      this.router.navigate(['/checkout']);
    }
  }

  continueShopping(): void {
    this.router.navigate(['/books']);
  }
}
