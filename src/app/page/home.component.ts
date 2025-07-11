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
  currentPage: number = 1;
  totalPages: number = 1;
  totalProducts: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadProducts(1);
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/products/giay.jpg'; // Ảnh mặc định
  }

  loadProducts(page: number = 1): void {
    this.authService.getProductsPage(page).subscribe({
      next: (data: any) => {
        const productsArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        this.products = productsArray.map((item: any) => ({
          ...item,
          image: item.image ? item.image : 'assets/images/products/giay.jpg'
        }));
        this.filteredProducts = this.products.slice();
        this.currentPage = page;
        this.totalPages = Math.ceil(data.count / productsArray.length);
        this.totalProducts = data.count; // Cập nhật tổng số sản phẩm
      },
      error: (error: any) => {
        console.error('Lỗi khi tải sản phẩm:', error);
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

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadProducts(page);
  }
}
