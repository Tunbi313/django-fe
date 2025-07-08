import { Routes } from '@angular/router';
import { HomeComponent } from './page/home.component';
import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';
import { ProductComponent } from './product/product.component';
import { ProductManageComponent } from './admin/product-manage/product-manage.component';
import { AddProductComponent } from './admin/product-manage/add-product/add_product.component';
import { UpdateProductComponent } from './admin/product-manage/update-product/update_product.component';
import { OrderListComponent } from './admin/oder/orderlist/orderlist.component';
import { CartItemComponent } from './oder/cart/cartItem.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'detail/:id', component: ProductComponent },
  { path: 'admin', component: ProductManageComponent },
  { path: 'add_product', component: AddProductComponent },
  {path:'update_product/:id',component:UpdateProductComponent},
  {path:'cart',component:CartItemComponent},
  {path:'orderList',component:OrderListComponent},

];
