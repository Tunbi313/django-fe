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

  // Đăng xuất với JWT
  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      return this.http.post(`${this.apiUrl}/logout/`, { refresh: refreshToken });
    }
    // Nếu không có refresh token, chỉ xóa local storage
    this.clearLocalStorage();
    return new Observable(observer => {
      observer.next({ message: 'Đăng xuất thành công' });
      observer.complete();
    });
  }

  // Lưu JWT tokens vào localStorage
  saveTokens(accessToken: string, refreshToken: string, userInfo: any): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  // Xóa tất cả dữ liệu từ localStorage
  clearLocalStorage(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
  }

  // Lấy access token từ localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Tạo headers với JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
  }

  // Thêm sản phẩm mới
  createProduct(product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/products/`, product, { headers });
  }

  // Cập nhật sản phẩm
  updateProduct(product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/products/${product.id}/`, product, { headers });
  }

  // Lấy thông tin user từ localStorage
  getUserInfo(): any {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  // Kiểm tra xem user đã đăng nhập chưa
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // Lấy username của user đã đăng nhập
  getUsername(): string {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.username : '';
  }

  // Kiểm tra xem user có phải là admin không
  isAdmin(): boolean {
    const userInfo = this.getUserInfo();
    return userInfo ? !!userInfo.is_admin : false;
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/`);
  }

  getAllProducts(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/products/all/`, { headers });
  }

  getProductsPage(page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/?page=${page}`);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}/`);
  }

  deleteProduct(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/products/${id}/`, { headers });
  }

  // Thêm sản phẩm vào giỏ hàng
  addToCart(product_id: number, quantity: number = 1): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      `${this.apiUrl}/cart/add/`,
      { product_id, quantity },
      { headers }
    );
  }

  // Lấy giỏ hàng của user
  getCart(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/cart/`, { headers });
  }

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem(item_id: number, quantity: number): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.put(
      `${this.apiUrl}/cart/item/${item_id}/update/`,
      { quantity },
      { headers }
    );
  }

  // Xóa một sản phẩm khỏi giỏ hàng
  deleteCartItem(item_id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/cart/item/${item_id}/remove/`, { headers });
  }

  clearCart(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/cart/remove/`, { headers });
  }

  // Lấy profile người dùng
  getProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/profile/`, { headers });
  }

  // Cập nhật profile (PUT)
  updateProfile(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/profile/`, data, { headers });
  }

  // Tạo mới profile (POST)
  createProfile(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/profile/`, data, { headers });
  }

  // Tạo order từ cart (checkout)
  checkoutOrder(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/orders/checkout/`, {}, { headers });
  }

  // Lấy chi tiết order theo id
  getOrderById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/orders/${id}/`, { headers });
  }

  // Cập nhật order
  updateOrder(orderId: string, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/`, data, { headers });
  }

  payOrder(orderId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/orders/${orderId}/pay/`, {}, { headers });
  }

  getOrderByUser(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/orders/`, { headers });
  }
  
  // Lấy tất cả order cho admin
  getAllOrdersAdmin(searchTerm: string = ''): Observable<any> {
    const headers = this.getAuthHeaders();
    let url = `${this.apiUrl}/admin/orders/`;
    if (searchTerm) {
      url += `?search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get(url, { headers });
  }

  //Lấy tất cả UserProfile
  getAllUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/admin/userprofiles/`, { headers });
  }

  updateOrderInfo(orderId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/orders/${orderId}/update-info`, data, { headers });
  }
  
  deleteOrderAdmin(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/admin/orders/${orderId}/`, { headers });
  }

  markOrderDelivered(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/admin/orders/${orderId}/`, { status: 'delivered' }, { headers });
  }
}   