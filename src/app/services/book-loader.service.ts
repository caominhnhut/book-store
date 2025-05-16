import { Injectable } from '@angular/core';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookLoaderService {
  constructor() {
    console.log('BookLoaderService initialized - chức năng đã được chuyển sang BookService');
  }
}
