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
import { CheckOutComponent } from './oder/checkout/checkout.component';
import { UserProfileComponent } from './user/userprofile/userprofile.component';
import { UserUpdateComponent } from './user/updateuser/userupdate.component';
import { PaidComponent } from './oder/paid/paid.component';
import { UserListComponent } from './admin/userlist/userlist.component';



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
  {path:'checkout',component:CheckOutComponent},
  {path:'userprofile',component:UserProfileComponent},
  {path:'userupdate',component:UserUpdateComponent},
  {path:'paid',component:PaidComponent},
  {path:'paid/:id', component: PaidComponent },
  {path:'userlist',component:UserListComponent}

];
