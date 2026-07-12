import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../core/services/appointment.service';
import { SlotService } from '../../../core/services/slot.service';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './vendor.html',
  styleUrl: './vendor.css'
})
export class Vendor {

  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private slotService = inject(SlotService);
  private router = inject(Router);

  slots: any[] = [];

  vendorForm = this.fb.group({

    name: ['', Validators.required],

    mobile: ['', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$')
    ]],

    email: ['', Validators.email],

    organizationName: ['', Validators.required],

    purpose: ['', Validators.required],

    appointmentDate: ['', Validators.required],

    slot: ['', Validators.required],

    remarks: ['']

  });

  loadSlots() {

    const date = this.vendorForm.value.appointmentDate;

    if (!date) return;

    this.slotService.getAvailableSlots(date)
      .subscribe({

        next: (response: any) => {

          this.slots = response.data;

        },

        error: err => console.error(err)

      });

  }

  submit() {

    if (this.vendorForm.invalid) {

      this.vendorForm.markAllAsTouched();

      return;

    }

    const value = this.vendorForm.getRawValue();

    const payload = {

      name: value.name,

      visitorType: 'VENDOR',

      mobile: value.mobile,

      email: value.email,

      organizationName: value.organizationName,

      purpose: value.purpose,

      appointmentDate: value.appointmentDate,

      slot: value.slot,

      remarks: value.remarks

    };

    this.appointmentService.createAppointment(payload)
      .subscribe({

        next: () => {

          this.router.navigate(['/success']);

        },

        error: err => {

          console.error(err);

        }

      });

  }

}