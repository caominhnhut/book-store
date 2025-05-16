// src/app/models/types.ts
// Định nghĩa các interface/type chung

// Book interface sơ lược không tham chiếu đến Promotion
export interface IBook {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rating?: number;
}
