import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { HeaderAdminComponent } from '../../component/header-admin/header-admin.component';


@Component({
  selector: 'app-product-manage',
  imports:[RouterOutlet,FormsModule,RouterModule,CommonModule,SidebarComponent,HeaderAdminComponent],
  templateUrl: './product-manage.component.html',
  styleUrls: ['./product-manage.component.css'],
  standalone: true,
})
export class ProductManageComponent implements OnInit {
  products: any[] =[];
  showDeleteModal: boolean = false;
  productToDelete: any = null;
  showSuccessMessage: boolean = false;
  
  constructor(private authService:AuthService){}
  ngOnInit() : void{
    this.loadProducts();
  }
  loadProducts(): void {
    this.authService.getAllProducts().subscribe({
      next: (data: any) => {
        // data là mảng sản phẩm
        const productsArray = Array.isArray(data) ? data : [];
        this.products = productsArray.map((item: any) => ({
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

  onDeleteProduct(productId: number) {
    // Tìm sản phẩm cần xóa để hiển thị tên trong modal
    this.productToDelete = this.products.find(p => p.id === productId);
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.authService.deleteProduct(this.productToDelete.id).subscribe({
        next: (res) => {
          console.log('Xóa thành công', res);
          this.showDeleteModal = false;
          this.showSuccessMessage = true;
          
          // Ẩn thông báo thành công sau 3 giây
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
          
          // Cập nhật lại danh sách sản phẩm
          this.loadProducts();
        },
        error: (err) => {
          console.error('Lỗi khi xóa sản phẩm', err);
          this.showDeleteModal = false;
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }
}

