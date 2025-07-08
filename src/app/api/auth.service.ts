import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Thay đổi thành URL backend của bạn

  constructor(private http: HttpClient) {}

  register(data: { username: string; password: string; email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  login(data: { username: string; password: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, data);
  }

  // Thêm sản phẩm mới
  createProduct(product: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.post(`${this.apiUrl}/products/`, product, { headers });
  }

  // Cập nhật sản phẩm
  updateProduct(product: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });
    return this.http.put(`${this.apiUrl}/products/${product.id}/`, product, { headers });
  }


  // Lấy thông tin user từ localStorage
  getUserInfo(): any {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Kiểm tra xem user đã đăng nhập chưa
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  // Lấy username của user đã đăng nhập
  getUsername(): string {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.username : '';
  }

  // Đăng xuất
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}/`);
  }

  deleteProduct(productId: number) {
    return this.http.delete(`${this.apiUrl}/products/${productId}/`);
  }
   // Thêm sản phẩm vào giỏ hàng
  addToCart(product_id: number, quantity: number = 1): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(
      `${this.apiUrl}/cart/add/`,
      { product_id, quantity },
      { headers }
    );
  }
}   