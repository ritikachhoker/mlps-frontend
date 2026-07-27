import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './success.html',
  styleUrl: './success.css'
})
export class Success {

  private router = inject(Router);

  bookingId = '';
  status = 'PENDING';

  constructor() {

    const state = history.state;

    this.bookingId = state.bookingId || '';
    this.status = state.status || 'PENDING';

  }

}