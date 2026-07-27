import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { FormsModule } from '@angular/forms'
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService);
  private appointmentService = inject(AppointmentService);

recentAppointments: any[] = [];
  dashboard: any = {};
  loading = true;
  search = '';
status = 'ALL';
selectedDate = '';

allRecentAppointments: any[] = [];

  ngOnInit(): void {
    this.loadDashboard();

  // this.loadRecentAppointments();
  }
 loadRecentAppointments() {

  this.appointmentService.getAppointments(1, 5).subscribe({

    next: (response: any) => {

  this.allRecentAppointments = response.data.appointments;
  this.recentAppointments = [...this.allRecentAppointments];

},

    error: (err) => {

      console.error(err);

    }

  });

}
  loadDashboard() {

  this.loading = true;

  this.dashboardService.getDashboard().subscribe({

    next: (response: any) => {

      this.dashboard = response.data;

      // Load appointments after dashboard is ready
      this.loadRecentAppointments();

      this.loading = false;

    },

    error: (err) => {

      console.error('Dashboard Error:', err);

      this.loading = false;

    }

  });

}
filterAppointments() {

  this.recentAppointments = this.allRecentAppointments.filter((appointment: any) => {

    const keyword = this.search.toLowerCase();

    const matchesSearch =
      appointment.name.toLowerCase().includes(keyword) ||
      appointment.mobile.includes(keyword) ||
      appointment.email.toLowerCase().includes(keyword) ||
      appointment.bookingId.toLowerCase().includes(keyword);

    const matchesStatus =
      this.status === 'ALL' ||
      appointment.status === this.status;

    const matchesDate =
      !this.selectedDate ||
      appointment.appointmentDate.substring(0, 10) === this.selectedDate;

    return matchesSearch && matchesStatus && matchesDate;

  });

}
}