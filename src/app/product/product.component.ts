import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../component/header/header.component';
import { FooterComponent } from '../component/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../api/auth.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent, RouterModule]
})
export class ProductComponent implements OnInit {
  product: any = null;
  quantity: number = 1;
  message: string = '';
  relatedProducts: any[] = [];
  currentRelatedPage: number = 1;
  pageSizeRelated: number = 4;
  totalRelatedPages: number = 1;
  pagedRelatedProducts: any[] = [];

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.authService.getProductById(id).subscribe({
          next: (data: any) => {
            this.product = data;
            // Lấy sản phẩm liên quan
            this.authService.getRelatedProducts(id).subscribe({
              next: (res: any) => {
                this.relatedProducts = Array.isArray(res) ? res : (res?.results || []);
                this.totalRelatedPages = Math.ceil(this.relatedProducts.length / this.pageSizeRelated) || 1;
                this.currentRelatedPage = 1;
                this.getRelatedProductsPage();
              },
              error: () => {
                this.relatedProducts = [];
                this.pagedRelatedProducts = [];
                this.totalRelatedPages = 1;
                this.currentRelatedPage = 1;
              }
            });
          },
          error: (err: any) => {
            this.product = null;
          }
        });
      }
    });
  }

  getRelatedProductsPage() {
    const start = (this.currentRelatedPage - 1) * this.pageSizeRelated;
    const end = start + this.pageSizeRelated;
    this.pagedRelatedProducts = this.relatedProducts.slice(start, end);
  }

  goToRelatedPage(page: number) {
    if (page < 1 || page > this.totalRelatedPages) return;
    this.currentRelatedPage = page;
    this.getRelatedProductsPage();
  }

  addToCart() {
    if (!this.product) return;
    this.authService.addToCart(this.product.id, this.quantity).subscribe({
      next: (res) => {
        this.message = res.message || 'Đã thêm vào giỏ hàng';
      },
      error: (err) => {
        this.message = err.error?.error || 'Có lỗi xảy ra';
      }
    });
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
