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
    image: '',
    category: '' // Thêm trường category
  };
  categories: any[] = []; // Thêm biến này
  message = '';
  error = '';
  adminToken: string | null = null;
  adminInfo: any = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.adminToken = localStorage.getItem('authToken');
    const userInfo = localStorage.getItem('userInfo');
    this.adminInfo = userInfo ? JSON.parse(userInfo) : null;
    // Lấy danh sách category
    this.authService.getAllCategory().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.categories = data;
        } else if (data && Array.isArray(data.results)) {
          this.categories = data.results;
        } else if (data && Array.isArray(data.data)) {
          this.categories = data.data;
        } else {
          this.categories = [];
        }
      },
      error: (err) => {
        this.categories = [];
        console.error('Lỗi lấy category:', err);
      }
    });
  }

  onSubmit() {
    this.message = '';
    this.error = '';
    const priceNumber = Number(this.product.price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      this.error = 'Giá sản phẩm phải là số dương!';
      return;
    }
    if (priceNumber > 9999999999) {
      this.error = 'Giá VND không được vượt quá 9.999.999.999!';
      return;
    }
    if (!this.product.category) {
      this.error = 'Bạn phải chọn category!';
      return;
    }
    // Gửi category_id, giữ nguyên giá VND
    const productToSend: any = {
      ...this.product,
      price: priceNumber,
      category_id: this.product.category
    };
    delete productToSend.category;
    this.authService.createProduct(productToSend).subscribe({
      next: (res) => {
        this.message = 'Thêm sản phẩm thành công!';
        this.product = { name: '', description: '', price: '', quantity: '', image: '', category: '' };
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
