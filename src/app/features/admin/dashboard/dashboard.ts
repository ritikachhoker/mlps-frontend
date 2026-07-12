import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AppointmentService } from '../../../core/services/appointment.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private dashboardService = inject(DashboardService);
  private appointmentService = inject(AppointmentService);

recentAppointments: any[] = [];
  dashboard: any = {};

  ngOnInit(): void {
    this.loadDashboard();
     this.loadDashboard();

  this.loadRecentAppointments();
  }
  loadRecentAppointments() {

  this.appointmentService.getAppointments().subscribe({

    next: (response: any) => {

      this.recentAppointments = response.data.appointments;

    },

    error: console.error

  });

}
  loadDashboard() {

    this.dashboardService.getDashboard().subscribe({

      // next: (response: any) => {

      //   this.dashboard = response.data;

      // },
      next: (response: any) => {

  console.log(response);
  console.log(response.data);

  this.dashboard = response.data;

       },

      error: (err) => {

        console.error(err);

      }

    });

  }

}