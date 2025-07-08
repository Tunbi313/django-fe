import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../component/sidebar/sidebar';


@Component({
  selector: 'app-product-manage',
  imports:[RouterOutlet,FormsModule,RouterModule,CommonModule,SidebarComponent],
  templateUrl: './product-manage.component.html',
  styleUrls: ['./product-manage.component.css'],
  standalone: true,
})
export class ProductManageComponent implements OnInit {
  products: any[] =[];

  constructor(private authService:AuthService){}
  ngOnInit() : void{
    this.loadProducts();
  }
  loadProducts(): void{
    this.authService.getProducts().subscribe({
      next: (data: any) => {
        this.products = data.map((item: any) => ({
          ...item,
          image: item.image ? item.image : 'assets/images/products/giay.jpg'
        }));
        console.log('Products loaded:', this.products);
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
      }
    });
  }

  deleteProduct(productId: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.authService.deleteProduct(productId).subscribe({
        next: () => {
          // Xóa thành công, cập nhật lại danh sách
          this.products = this.products.filter(product => product.id !== productId);
          alert('Đã xóa sản phẩm thành công!');
        },
        error: (err) => {
          alert('Xóa sản phẩm thất bại!');
          console.error(err);
        }
      });
    }
  }
}
