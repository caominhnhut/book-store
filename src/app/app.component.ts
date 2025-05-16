import { Component, OnInit } from '@angular/core';
import { ImagePlaceholderService } from './services/image-placeholder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'book-store-app';
  
  constructor(private imagePlaceholderService: ImagePlaceholderService) {}
  
  ngOnInit(): void {
    // Call the service to create placeholders for mythology books
    setTimeout(() => {
      this.imagePlaceholderService.createMythologyPlaceholders();
    }, 2000); // Wait for DOM to render
  }
}
