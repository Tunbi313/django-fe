import { Component } from '@angular/core';
import { HeaderComponent } from '../../component/header/header.component';
import { FooterComponent } from '../../component/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../api/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule]
})
export class LoginComponent {
  username = '';
  password = '';
  message = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.message = '';
    this.error = '';
    
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => { 
          this.message = res.message; 
          
          // Hiển thị token trong console
          console.log('Token:', res.token);
          
          // Lưu token và thông tin user vào localStorage
          localStorage.setItem('authToken', res.token);
          localStorage.setItem('userInfo', JSON.stringify(res.user));
          console.log('User info:', res.user);

          // Nếu là admin thì chuyển hướng sang trang quản lý sản phẩm
          if (res.user && (res.user.role === 'admin' || res.user.is_admin === true)) {
            this.router.navigate(['/admin']);
          }
        },
        error: (err) => { 
          this.error = err.error?.error || 'Đăng nhập thất bại'; 
        }
      });
  }

  // Xử lý đăng ký
  onRegister() {
    // Chuyển hướng sang trang đăng ký
    this.router.navigate(['/register']);
  }
}