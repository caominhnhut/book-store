// src/app/models/promotion.ts
import { IBook } from './types';

// Loại khuyến mãi
export enum PromotionType {
  PERCENT = 'percent', // Giảm theo phần trăm
  FIXED = 'fixed',    // Giảm số tiền cố định
  BUNDLE = 'bundle',  // Mua kèm (combo)
  GIFT = 'gift'       // Tặng kèm quà
}

export interface Promotion {
  id: string | number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  
  // Trường mới cho tính năng sách của tháng
  discountPercent?: number;
  discountType?: 'percentage' | 'fixed';
  imageUrl?: string;
  books?: IBook[];
  isActive?: boolean;
  badges?: string[];

  // Trường từ mã hiệu có
  type?: PromotionType;
  value?: number;
  code?: string;
}

export interface BookOfMonth extends Promotion {
  month: number;
  year: number;
  books: IBook[]; // Bắt buộc có books trong BookOfMonth
  featuredBook?: IBook; // Sách nổi bật trong tháng
  discountPercent: number;
  discountType: 'percentage' | 'fixed';
  isActive: boolean;
}
