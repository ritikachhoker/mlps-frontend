import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule,CommonModule,FormsModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class Appointments implements OnInit {

  private appointmentService = inject(AppointmentService);

  appointments: any[] = [];
filteredAppointments: any[] = [];

search = '';
status = 'ALL';
fromDate = '';
toDate = '';
  ngOnInit(): void {
    this.loadAppointments();
  }

 loadAppointments() {

  this.appointmentService.getAppointments().subscribe({

    next: (response: any) => {

      this.appointments = response.data.appointments;

      this.filteredAppointments = [...this.appointments];

    },

    error: console.error

  });

}
  filterAppointments() {

  this.filteredAppointments = this.appointments.filter((appointment: any) => {

    // Search
    const keyword = this.search.toLowerCase();

    const matchesSearch =
      appointment.name.toLowerCase().includes(keyword) ||
      appointment.mobile.includes(keyword) ||
      appointment.email.toLowerCase().includes(keyword);

    // Status
    const matchesStatus =
      this.status === 'ALL' ||
      appointment.status === this.status;

    // Date

    const appointmentDate =
      appointment.appointmentDate.substring(0,10);

    const matchesFrom =
      !this.fromDate ||
      appointmentDate >= this.fromDate;

    const matchesTo =
      !this.toDate ||
      appointmentDate <= this.toDate;

    return matchesSearch &&
           matchesStatus &&
           matchesFrom &&
           matchesTo;

  });

}
  approve(id: string) {

    this.appointmentService.approveAppointment(id)
      .subscribe(() => {

        this.loadAppointments();

      });

  }

  reject(id: string) {

    this.appointmentService.rejectAppointment(id)
      .subscribe(() => {

        this.loadAppointments();

      });

  }

}