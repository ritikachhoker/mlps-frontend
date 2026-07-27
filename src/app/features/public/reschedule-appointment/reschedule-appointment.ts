import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { AppointmentService } from '../../../core/services/appointment.service';
import { SlotService } from '../../../core/services/slot.service';

@Component({
  selector: 'app-reschedule-appointment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './reschedule-appointment.html',
  styleUrl: './reschedule-appointment.css'
})
export class RescheduleAppointment {

  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private slotService = inject(SlotService);

  slots: any[] = [];

  loading = false;

  successMessage = '';

  errorMessage = '';

  rescheduleForm = this.fb.group({

    bookingId: [
      '',
      Validators.required
    ],

    mobile: [
      '',
      [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]
    ],

    newDate: [
      '',
      Validators.required
    ],

    newSlotId: [
      '',
      Validators.required
    ]

  });

  onDateChange(event: Event) {

    const date = (event.target as HTMLInputElement).value;

    if (!date) {

      this.slots = [];

      return;

    }

    this.loading = true;

    this.slotService.getAvailableSlots(date).subscribe({

      next: (response: any) => {

        this.loading = false;

        this.slots = response.data;

      },

      error: (err) => {

        this.loading = false;

        this.slots = [];

        console.error(err);

      }

    });

  }

  submit() {

    this.successMessage = '';

    this.errorMessage = '';

    if (this.rescheduleForm.invalid) {

      this.rescheduleForm.markAllAsTouched();

      return;

    }

    const form = this.rescheduleForm.getRawValue();

    this.loading = true;

    this.appointmentService.rescheduleAppointment(

      form.bookingId!,
      form.mobile!,
      form.newDate!,
      form.newSlotId!

    ).subscribe({

      next: (response: any) => {

        this.loading = false;

        this.successMessage =
          response.message ||
          'Appointment rescheduled successfully.';

        this.rescheduleForm.reset();

        this.slots = [];

      },

      error: (err) => {

        this.loading = false;

        this.errorMessage =
          err.error?.message ||
          'Unable to reschedule appointment.';

      }

    });

  }

}