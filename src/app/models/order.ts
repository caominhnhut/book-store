import { CartItem } from './cart-item';
import { Address } from './user';

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  discountAmount?: number; // Thêm trường khuyến mãi, có thể null
  orderDate: Date;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
  E_WALLET = 'E_WALLET'
}