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
  allProducts: any[] = [];
  pageSize: number = 12;
  selectedCategoryId: string = '';
  priceRange: { min: number, max: number|null } | null = null;

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.currentPage = 1;
      this.loadAllProducts();
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

  loadAllProducts(): void {
    this.authService.getAllProducts().subscribe({
      next: (data: any) => {
        const productsArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        this.allProducts = productsArray.map((item: any) => ({
          ...item,
          image: item.image ? item.image : 'assets/images/products/giay.jpg'
        }));
        this.applyFilterAndPaging();
      },
      error: (error: any) => {
        console.error('Lỗi khi tải sản phẩm:', error);
      }
    });
  }

  loadProductsByCategory(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;
    this.sortOrder = '';
    this.searchTerm = '';
    this.authService.getProductByCategory(categoryId).subscribe({
      next: (data: any) => {
        const productsArray = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        this.allProducts = productsArray.map((item: any) => ({
          ...item,
          image: item.image ? item.image : 'assets/images/products/giay.jpg'
        }));
        this.applyFilterAndPaging();
      },
      error: (error: any) => {
        console.error('Lỗi khi tải sản phẩm theo category:', error);
      }
    });
  }

  filterByPriceRange(min: number, max: number|null) {
    this.priceRange = { min, max };
    this.currentPage = 1;
    this.applyFilterAndPaging();
  }

  applyFilterAndPaging() {
    // Lọc theo search
    let filtered = this.allProducts;
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.trim().toLowerCase();
      filtered = filtered.filter(product =>
        product.name && product.name.toLowerCase().includes(term)
      );
    }
    // Lọc theo khoảng giá
    if (this.priceRange) {
      filtered = filtered.filter(product => {
        if (product.price == null || this.priceRange == null) return false;
        const price = parseFloat(product.price);
        if (this.priceRange.max === null) {
          return price >= this.priceRange.min;
        }
        return price >= this.priceRange.min && price < this.priceRange.max;
      });
    }
    // Sắp xếp
    if (this.sortOrder === 'price') {
      filtered = filtered.slice().sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (this.sortOrder === 'price-desc') {
      filtered = filtered.slice().sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    this.totalProducts = filtered.length;
    this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
    // Phân trang
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredProducts = filtered.slice(start, end);
  }

  onSortChange(event: any) {
    this.sortOrder = event.target.value;
    this.currentPage = 1;
    this.applyFilterAndPaging();
  }

  onFilter() {
    this.currentPage = 1;
    this.applyFilterAndPaging();
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilterAndPaging();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilterAndPaging();
  }
}
