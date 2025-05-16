import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagePlaceholderService {

  constructor() { }
  
  /**
   * Xử lý hình ảnh bị lỗi
   */
  createMythologyPlaceholders(): void {
    // Lấy danh sách thẻ img và kiểm tra đường dẫn
    setTimeout(() => {
      const images = document.querySelectorAll('img');
      
      images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.includes('book-')) {
          // Lưu lại đường dẫn gốc
          const originalSrc = img.src;
          
          // Thiết lập xử lý lỗi cho hình ảnh
          img.onerror = () => {
            console.log('Hình ảnh không tải được:', originalSrc);
            
            // Tạo placeholder với màu nền và tên sách
            const parentElement = img.parentElement;
            if (parentElement) {
              // Tạo styled div thay thế img
              const placeholder = document.createElement('div');
              placeholder.style.backgroundColor = this.getRandomColor();
              placeholder.style.width = '100%';
              placeholder.style.height = '100%';
              placeholder.style.display = 'flex';
              placeholder.style.alignItems = 'center';
              placeholder.style.justifyContent = 'center';
              placeholder.style.color = 'white';
              placeholder.style.fontWeight = 'bold';
              placeholder.style.textAlign = 'center';
              placeholder.style.padding = '20px';
              placeholder.style.boxSizing = 'border-box';
              
              // Lấy tên sách từ card nếu có
              let bookTitle = '';
              const titleElement = parentElement.querySelector('.book-title') || 
                                  parentElement.querySelector('.book-title-simple');
              if (titleElement) {
                bookTitle = titleElement.textContent || '';
              }
              
              // Hiển thị tên sách hoặc text mặc định
              placeholder.textContent = bookTitle || 'Sách';
              
              // Thay thế img bằng placeholder
              img.style.display = 'none';
              parentElement.insertBefore(placeholder, img);
            }
          };
        }
      });
    }, 1000); // Đợi 1 giây để DOM được render
  }

  // Tạo màu ngẫu nhiên cho placeholder
  private getRandomColor(): string {
    const colors = [
      '#8A2BE2', '#9370DB', '#6A5ACD', '#483D8B', '#7B68EE',
      '#4B0082', '#9932CC', '#8B008B', '#800080', '#BA55D3'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  /**
   * Creates a data URL for a placeholder image with custom text and styling
   * 
   * @param text The text to display on the placeholder
   * @param width Image width
   * @param height Image height
   * @param bgColor Background color
   * @param textColor Text color
   * @returns A data URL string representing the image
   */
  createBookCoverPlaceholder(
    title: string,
    author: string,
    width: number = 300, 
    height: number = 450
  ): string {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#7c3aed');     // Purple at top
    gradient.addColorStop(1, '#4f46e5');     // Indigo at bottom
    
    // Fill background with gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add a subtle pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < width; i += 20) {
      for (let j = 0; j < height; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.fillRect(i, j, 10, 10);
        }
      }
    }
    
    // Add a border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 6;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    
    // Add titles
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    // Format and wrap title
    const formattedTitle = this.formatText(title, 18);
    
    // Draw title
    ctx.font = 'bold 24px Arial, sans-serif';
    const titleLines = formattedTitle.split('\n');
    const titleY = height * 0.4;
    const titleLineHeight = 30;
    
    for (let i = 0; i < titleLines.length; i++) {
      ctx.fillText(
        titleLines[i], 
        width / 2, 
        titleY + (i * titleLineHeight)
      );
    }
    
    // Draw author
    ctx.font = 'italic 18px Arial, sans-serif';
    ctx.fillText(author, width / 2, height * 0.65);
    
    // Return the data URL
    return canvas.toDataURL('image/jpeg', 0.9);
  }
  
  private formatText(text: string, maxLength: number): string {
    // Split text into words
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    // Build lines of appropriate length
    for (const word of words) {
      if (currentLine.length + word.length + 1 <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    
    // Add the last line
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Join lines with newlines
    return lines.join('\n');
  }
}
