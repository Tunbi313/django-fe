import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-oderItem',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './orderItem.component.html',
  styleUrls: ['./orderItem.component.css']
})
export class OrderItemComponent  {}