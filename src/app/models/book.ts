import { Promotion } from './promotion';
import { IBook } from './types';

export interface Book extends IBook {
    category: string;
    publishedDate: Date;
    pages: number;
    isbn: string;
    inStock: number;
    language?: string;  // Tiếng Việt, Tiếng Anh, etc.
    isPartOfSeries?: boolean;
    seriesName?: string;
    seriesTotal?: number;  // Tổng số cuốn trong bộ
    seriesPosition?: number;  // Vị trí của cuốn này trong bộ
    discount?: number;  // Phần trăm giảm giá (nếu có)
    isBookOfMonth?: boolean; // Đánh dấu sách thuộc chương trình "Sách của tháng"
    promotions?: Promotion[]; // Các khuyến mãi đặc biệt
}