import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-cancel-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cancel-appointment.html',
  styleUrl: './cancel-appointment.css'
})
export class CancelAppointment {

  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);

  successMessage = '';
  errorMessage = '';

  cancelForm = this.fb.group({

    bookingId: ['', Validators.required],

    mobile: [
      '',
      [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]
    ],

    cancellationReason: ['', Validators.required]

  });

  submit() {

    this.successMessage = '';
    this.errorMessage = '';

    if (this.cancelForm.invalid) {

      this.cancelForm.markAllAsTouched();

      return;

    }

    const value = this.cancelForm.getRawValue();

    this.appointmentService.cancelAppointment(

      value.bookingId!,
      value.mobile!,
      value.cancellationReason!

    ).subscribe({

      next: () => {

        this.successMessage =
          'Appointment cancelled successfully.';

        this.cancelForm.reset();

      },

      error: (err) => {

        this.errorMessage =
          err.error?.message || 'Cancellation failed.';

      }

    });

  }

}