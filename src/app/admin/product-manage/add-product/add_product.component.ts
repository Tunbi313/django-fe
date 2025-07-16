import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../component/sidebar/sidebar';
import { AuthService } from '../../../api/auth.service';
import { HeaderAdminComponent } from '../../../component/header-admin/header-admin.component';

@Component({
  selector: 'app-add_product',
  imports:[RouterOutlet,FormsModule,RouterModule,CommonModule,SidebarComponent,HeaderAdminComponent],
  templateUrl: './add_product.component.html',
  styleUrls: ['./add_product.component.css'],
  standalone: true,
})
export class AddProductComponent implements OnInit {
  product = {
    name: '',
    description: '',
    price: '',
    quantity: '',
    image: ''
  };
  message = '';
  error = '';
  adminToken: string | null = null;
  adminInfo: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.adminToken = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');
    this.adminInfo = userInfo ? JSON.parse(userInfo) : null;
    console.log('Admin token:', this.adminToken);
    console.log('Admin info:', this.adminInfo);
  }

  onSubmit() {
    this.message = '';
    this.error = '';
    const USD_TO_VND = 25000;
    const priceNumber = Number(this.product.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      this.error = 'Giá sản phẩm phải là số dương!';
      return;
    }
    // Quy đổi giá sang VND trước khi gửi
    const productToSend = {
      ...this.product,
      price: Math.round(priceNumber * USD_TO_VND)
    };
    this.authService.createProduct(productToSend).subscribe({
      next: (res) => {
        this.message = 'Thêm sản phẩm thành công!';
        // Reset form nếu muốn
        this.product = { name: '', description: '', price: '', quantity: '', image: '' };
      },
      error: (err) => {
        if (err.error && err.error.price) {
          this.error = 'Lỗi giá: ' + err.error.price.join(', ');
        } else if (err.error && typeof err.error === 'object') {
          this.error = Object.entries(err.error).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ');
        } else {
          this.error = 'Thêm sản phẩm thất bại!';
        }
        console.error(err);
      }
    });
  }
}
