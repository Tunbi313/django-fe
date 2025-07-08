import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../api/auth.service';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'shop';
  sortOrder: string = '';
  products: any[] = [];
  filteredProducts: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.filteredProducts = this.products.slice();
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/products/giay.jpg'; // Ảnh mặc định
  }

  loadProducts(): void {
    this.authService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.map((item: any) => ({
          ...item,
          image: item.image ? item.image : 'assets/images/products/giay.jpg'
        }));
        console.log('Products loaded:', this.products);
        this.filteredProducts = this.products.slice();
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
      }
    });
  }

  onSortChange(event: any) {
    this.sortOrder = event.target.value;
  }

  onFilter() {
    this.filteredProducts = this.products.slice();
    if (this.sortOrder === 'price') {
      this.filteredProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (this.sortOrder === 'price-desc') {
      this.filteredProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
  }
}
