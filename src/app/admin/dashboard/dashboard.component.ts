import { Component } from '@angular/core';
import { SidebarComponent } from '../../component/sidebar/sidebar';
import { HeaderAdminComponent } from '../../component/header-admin/header-admin.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [SidebarComponent, HeaderAdminComponent,CommonModule,RouterOutlet,FormsModule],
})
export class DashBoardComponent {}
