import { Component, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../api/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [RouterModule, CommonModule, FormsModule],
  standalone:true
})
export class HeaderComponent {
  searchTerm: string = '';
  @Output() search = new EventEmitter<string>();

  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: (res: any) => {
        console.log('Đăng xuất thành công:', res.message);
        // Xóa local storage và chuyển hướng về trang chủ
        this.authService.clearLocalStorage();
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Lỗi đăng xuất:', err);
        // Vẫn xóa local storage và chuyển hướng ngay cả khi có lỗi
        this.authService.clearLocalStorage();
        this.router.navigate(['/']);
      }
    });
  }

  goToCart() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/cart']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onUserIconClick() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/userprofile']);
    } else {
      window.alert('Vui lòng đăng nhập để xem trang cá nhân!');
      // Có thể thay window.alert bằng snackbar/toast nếu muốn đẹp hơn
    }
  }

  goToAdminManage() {
    this.router.navigate(['/admin']);
  }

  onSearch() {
    // Thêm log để kiểm tra click
    console.log('HeaderAdmin search click:', this.searchTerm);
    this.search.emit(this.searchTerm);
  }
}
