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
selectedAppointment: any = null;

search = '';
status = 'ALL';
fromDate = '';
toDate = '';
currentPage = 1;
totalPages = 1;
limit = 10;
  ngOnInit(): void {
    this.loadAppointments();
  }

loadAppointments() {

  this.appointmentService.getAppointments(
    this.currentPage,
    this.limit,
    this.search,
    this.status,
    this.fromDate,
    // this.toDate
  ).subscribe({

    next: (response: any) => {

      this.appointments = response.data.appointments;
      this.filteredAppointments = response.data.appointments;

      this.currentPage = response.data.currentPage;
      this.totalPages = response.data.totalPages;

    },

    error: console.error

  });

}
  onFilterChange() {

  this.currentPage = 1;

  this.loadAppointments();

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
  previousPage() {

  if (this.currentPage > 1) {

    this.currentPage--;

    this.loadAppointments();

  }

}

nextPage() {

  if (this.currentPage < this.totalPages) {

    this.currentPage++;

    this.loadAppointments();

  }

}
viewAppointment(appointment: any) {

  this.selectedAppointment = appointment;

}

closePopup() {

  this.selectedAppointment = null;

}

}