
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../../component/sidebar/sidebar';

@Component({
  selector: 'app-oderlist',
  standalone: true,
  imports:[CommonModule, FormsModule, RouterModule,SidebarComponent],
  templateUrl:'orderlist.component.html',
  styleUrls: ['./orderlist.component.css'],
  

})
export class OrderListComponent {}
