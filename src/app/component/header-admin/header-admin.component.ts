import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-headeradmin',
  standalone: true,
  imports: [RouterModule], // <-- BẮT BUỘC PHẢI CÓ DÒNG NÀY
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})
export class HeaderAdminComponent {}
