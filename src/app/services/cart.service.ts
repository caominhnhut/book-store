import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    // Khôi phục giỏ hàng từ localStorage (nếu có)
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(book: Book, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItemIndex = currentItems.findIndex(item => item.book.id === book.id);

    if (existingItemIndex !== -1) {
      // Cập nhật số lượng nếu sách đã có trong giỏ hàng
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItemsSubject.next(updatedItems);
    } else {
      // Thêm sách mới vào giỏ hàng
      const newItem: CartItem = { book, quantity };
      this.cartItemsSubject.next([...currentItems, newItem]);
    }

    // Lưu giỏ hàng vào localStorage
    this.saveCartToLocalStorage();
  }

  updateQuantity(bookId: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const itemIndex = currentItems.findIndex(item => item.book.id === bookId);

    if (itemIndex !== -1) {
      const updatedItems = [...currentItems];
      if (quantity <= 0) {
        // Xóa sách khỏi giỏ hàng nếu số lượng <= 0
        updatedItems.splice(itemIndex, 1);
      } else {
        // Cập nhật số lượng
        updatedItems[itemIndex].quantity = quantity;
      }
      this.cartItemsSubject.next(updatedItems);
      this.saveCartToLocalStorage();
    }
  }

  removeFromCart(bookId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.book.id !== bookId);
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToLocalStorage();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cart');
  }

  getTotalAmount(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.book.price * item.quantity, 
      0
    );
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }
}