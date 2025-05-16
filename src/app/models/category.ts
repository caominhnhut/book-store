export interface Category {
  id: string;
  name: string;
  count: number;  // Số lượng sách trong danh mục
  englishName?: string; // Tên tiếng Anh của danh mục
}
