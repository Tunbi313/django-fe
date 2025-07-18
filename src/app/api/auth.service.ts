import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1'; // URL backend mới

  constructor(private http: HttpClient) {}

  // Đăng ký tài khoản
  register(data: { username: string; password: string; email: string; first_name?: string; last_name?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register/`, data);
  }

  // Đăng nhập (JWT)
  login(data: { username: string; password: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login/`, data);
  }

  // Đăng xuất (blacklist refresh token)
  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      return this.http.post(`${this.apiUrl}/users/logout/`, { refresh: refreshToken });
    }
    this.clearLocalStorage();
    return new Observable(observer => {
      observer.next({ message: 'Đăng xuất thành công' });
      observer.complete();
    });
  }

  // Làm mới access token
  refreshToken(refresh: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/token/refresh/`, { refresh });
  }

  // Lấy thông tin user hiện tại
  getMe(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users/me/`, { headers });
  }

  // Cập nhật thông tin user hiện tại
  updateMe(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/users/me/`, data, { headers });
  }

  // Lấy profile user
  getProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users/profile/`, { headers });
  }

  // Cập nhật profile user
  updateProfile(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/users/profile/`, data, { headers });
  }

  // Tạo tài khoản admin
  createAdmin(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/users/create-admin/`, data, { headers });
  }

  // Danh sách user (admin)
  getAllUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users/admin/users/`, { headers });
  }

  // Danh sách profile user (admin)
  getAllUserProfiles(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users/admin/userprofiles/`, { headers });
  }

  // Sản phẩm
  getProducts(params: any = {}): Observable<any> {
    let url = `${this.apiUrl}/products/`;
    const query = new URLSearchParams(params).toString();
    if (query) url += `?${query}`;
    return this.http.get(url);
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}/`);
  }
//Lấy sản phẩm theo category
  getProductByCategory(id: string):Observable<any>{
    return this.http.get(`${this.apiUrl}/products/categories/${id}/products/`)
  }

  getRelatedProducts(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${productId}/related/`);
  }


  createProduct(product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/products/`, product, { headers });
  }

  updateProduct(product: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/products/${product.id}/`, product, { headers });
  }

  patchProduct(productId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/products/${productId}/`, data, { headers });
  }

  deleteProduct(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/products/${id}/`, { headers });
  }

  // Tìm kiếm sản phẩm
  searchProducts(term: string): Observable<any> {
    return this.getProducts({ search: term });
  }

  // Lọc sản phẩm theo danh mục
  filterProductsByCategory(category: string): Observable<any> {
    return this.getProducts({ category });
  }

  // Lấy toàn bộ sản phẩm không phân trang
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/all/`);
  }

  // Giỏ hàng
  getCart(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/cart/`, { headers });
  }

  addToCart(product_id: number, quantity: number = 1): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      `${this.apiUrl}/cart/add/`,
      { product_id, quantity },
      { headers }
    );
  }

  updateCartItem(item_id: number, quantity: number): Observable<any> {
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.put(
      `${this.apiUrl}/cart/item/${item_id}/update/`,
      { quantity },
      { headers }
    );
  }

  deleteCartItem(item_id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/cart/item/${item_id}/remove/`, { headers });
  }

  clearCart(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/cart/remove/`, { headers });
  }

  // Đơn hàng
  getOrders(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/orders/`, { headers });
  }

  createOrder(orderData: any = {}): Observable<any> {
    const headers = this.getAuthHeaders();
    // Nếu orderData là undefined/null thì chỉ truyền headers
    return this.http.post(`${this.apiUrl}/orders/checkout/`, orderData, { headers });
  }

  getOrderById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/orders/${id}/`, { headers });
  }

  updateOrder(orderId: string, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/orders/${orderId}/`, data, { headers });
  }

  patchOrder(orderId: string, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/orders/${orderId}/`, data, { headers });
  }

  deleteOrder(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/orders/${orderId}/`, { headers });
  }

  payOrder(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/orders/${orderId}/pay/`, {}, { headers });
  }

  // Lưu JWT tokens vào localStorage
  saveTokens(accessToken: string, refreshToken: string, userInfo: any): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  // Xóa tất cả dữ liệu từ localStorage
  clearLocalStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userInfo');
  }

  // Lấy access token từ localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Tạo headers với JWT token
  private getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : new HttpHeaders();
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
    return userInfo ? !!userInfo.is_staff : false;
  }

  // Lấy tất cả order cho admin
  getAllOrdersAdmin(searchTerm: string = ''): Observable<any> {
    const headers = this.getAuthHeaders();
    let url = `${this.apiUrl}/orders/admin/orders/`;
    if (searchTerm) {
      url += `?search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get(url, { headers });
  }

  //Lấy tất cả UserProfile
  getAllUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/users/admin/userprofiles/`, { headers });
  }

  updateOrderInfo(orderId: number, data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/orders/${orderId}/update-info/`, data, { headers });
  }
  
  deleteOrderAdmin(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/orders/admin/orders/${orderId}/`, { headers });
  }

  markOrderDelivered(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/orders/admin/orders/${orderId}/`, { status: 'delivered' }, { headers });
  }

  createProfile(data: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/users/profile/`, data, { headers });
  }

  // Lấy thông tin user từ localStorage
  getUserInfo(): any {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo || userInfo === 'undefined') return null;
    try {
      return JSON.parse(userInfo);
    } catch {
      return null;
    }
  }

  getOrderByIdAdmin(orderId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/orders/admin/orders/${orderId}/`, { headers });
  }

  chatWithBot(message: string, history: any[] = []): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(
      'http://127.0.0.1:8000/chatbot/chat/',
      { message, history },
      { headers }
    );
  }
}   