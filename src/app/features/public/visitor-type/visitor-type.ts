import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visitor-type',
  standalone: true,
  templateUrl: './visitor-type.html',
  styleUrl: './visitor-type.css'
})
export class VisitorType {

  selectedType = '';

  constructor(private router: Router) {}

  select(type: string) {
    this.selectedType = type;
  }

  continue() {
    if (this.selectedType === 'PARENT') {
      this.router.navigate(['/existing-parent']);
    } else if (this.selectedType === 'VENDOR') {
      this.router.navigate(['/vendor']);
    }
  }
}