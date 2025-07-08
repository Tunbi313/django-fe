import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../component/header/header.component';
import { FooterComponent } from '../component/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../api/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  imports: [FormsModule, CommonModule, HeaderComponent, FooterComponent]
})
export class ProductComponent implements OnInit {
  product: any = null;
  quantity: number = 1;
  message: string = '';

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.authService.getProductById(id).subscribe({
        next: (data: any) => {
          this.product = data;
        },
        error: (err: any) => {
          this.product = null;
        }
      });
    }
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
}
