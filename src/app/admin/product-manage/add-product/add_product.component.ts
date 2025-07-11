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
    this.authService.createProduct(this.product).subscribe({
      next: (res) => {
        this.message = 'Thêm sản phẩm thành công!';
        // Reset form nếu muốn
        this.product = { name: '', description: '', price: '', quantity: '', image: '' };
      },
      error: (err) => {
        this.error = 'Thêm sản phẩm thất bại!';
        console.error(err);
      }
    });
  }
}
