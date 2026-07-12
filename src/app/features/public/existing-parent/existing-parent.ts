import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import { SlotService } from '../../../core/services/slot.service';
import { OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-existing-parent',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './existing-parent.html',
  styleUrl: './existing-parent.css'
})
export class ExistingParent implements OnInit {

  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private slotService = inject(SlotService);
  private router = inject(Router);
  slots: any[] = [];

  ngOnInit(): void {
    // Nothing here for now
  }

  appointmentForm = this.fb.group({

    name: ['', Validators.required],

    mobile: [
      '',
      [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    studentName: ['', Validators.required],

    studentClass: ['', Validators.required],

    section: ['', Validators.required],

    purpose: ['', Validators.required],

    appointmentDate: ['', Validators.required],

    slot: ['', Validators.required],

    remarks: ['']

  });

  loadSlots() {

  console.log('loadSlots called');

  const date = this.appointmentForm.value.appointmentDate;

  console.log('Selected date:', date);

  if (!date) {
    return;
  }

  this.slotService.getAvailableSlots(date).subscribe({

  next: (response: any) => {

    console.log('API Response:', response);

    this.slots = response.data;

    console.log('Slots:', this.slots);

  },

  error: (err) => {

    console.error(err);

  }

});
}

  submit() {

    if (this.appointmentForm.invalid) {

      this.appointmentForm.markAllAsTouched();

      return;

    }

    const value = this.appointmentForm.value;

    const payload = {

      name: value.name,

      visitorType: 'PARENT',

      mobile: value.mobile,

      email: value.email,

      student: {

        name: value.studentName,

        class: value.studentClass,

        section: value.section

      },

      purpose: value.purpose,

      appointmentDate: value.appointmentDate,

      slot: value.slot,

      remarks: value.remarks

    };

    this.appointmentService.createAppointment(payload)
      .subscribe({

        next: (response: any) => {

  console.log(response);

  this.appointmentForm.reset();

  this.router.navigate(['/success']);

},

       error: (error) => {

  console.error('Full Error:', error);

  console.error('Backend Response:', error.error);

  alert(error.error?.message || 'Appointment could not be created.');

},


      });

  }

}