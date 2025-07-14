import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../api/auth.service';
import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

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
  product: any = null;
  quantity: number = 1;
  message: string = '';
  searchTerm: string = '';

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Lấy search term từ query string nếu có
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.loadProducts(1);
    });
  }

  onImgError(event: any) {
    event.target.src = 'assets/images/products/giay.jpg'; // Ảnh mặc định
  }

  addToCart(product: any) {
    if (!product) return;
    this.authService.addToCart(product.id, 1).subscribe({
      next: (res) => {
        this.message = res.message || 'Đã thêm vào giỏ hàng';
        setTimeout(() => this.message = '', 2000);
      },
      error: (err) => {
        this.message = err.error?.error || 'Có lỗi xảy ra';
        setTimeout(() => this.message = '', 2000);
      }
    });
  }

  loadProducts(page: number = 1): void {
    this.authService.getProducts({ page }).subscribe({
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
        const pageSize = productsArray.length > 0 ? productsArray.length : 1;
        this.totalPages = data.count ? Math.ceil(data.count / pageSize) : 1;
        this.totalProducts = data.count || this.products.length;
        // Nếu có searchTerm, tự động lọc
        if (this.searchTerm && this.searchTerm.trim()) {
          this.onSearch();
        }
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

  onSearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredProducts = this.products.slice();
      return;
    }
    this.filteredProducts = this.products.filter(product =>
      product.name && product.name.toLowerCase().includes(term)
    );
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.loadProducts(page);
  }
}
