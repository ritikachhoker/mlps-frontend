import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

  private router = inject(Router);

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('admin');

    this.router.navigate(['/admin/login']);

  }

}