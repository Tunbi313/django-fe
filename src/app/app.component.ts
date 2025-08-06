import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './page/login/login.component';
import { AuthService } from './api/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './page/home.component';
import { ChatbotComponent } from './chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, CommonModule,HeaderComponent,FooterComponent,ChatbotComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public router: Router) {}

  isAdminRoute() {
    return this.router.url.startsWith('/admin') || this.router.url.startsWith('/add_product') || this.router.url.startsWith('/update_product') || this.router.url.startsWith('/orderList') || this.router.url.startsWith('/userlist') || this.router.url.startsWith('/orderdetail') || this.router.url.startsWith('/dashboard') || this.router.url.startsWith('/category') || this.router.url.startsWith('/chatmanage');
  }
}
