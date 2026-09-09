import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { SlotService } from '../../../core/services/slot.service';

@Component({
  selector: 'app-time-slots',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './time-slots.html',
  styleUrl: './time-slots.css'
})
export class TimeSlots implements OnInit {

  private fb = inject(FormBuilder);
  private slotService = inject(SlotService);

  editingSlotId = '';

  slots: any[] = [];
  filteredSlots: any[] = [];

  searchText = '';

  loading = false;

  activeSlots = 0;
  inactiveSlots = 0;

  selectedDates: string[] = [];

  slotForm = this.fb.group({
    startTime: [
      '',
      Validators.required
    ],

    endTime: [
      '',
      Validators.required
    ],

    duration: [
      15,
      Validators.required
    ]
  });

  ngOnInit(): void {
    this.loadSlots();
  }

  loadSlots() {

    this.loading = true;

    this.slotService.getAllSlots().subscribe({

      next: (response: any) => {

        this.loading = false;

        this.slots = response.data || [];

        this.filteredSlots = [...this.slots];

        this.activeSlots =
          this.slots.filter(
            slot => slot.isActive
          ).length;

        this.inactiveSlots =
          this.slots.filter(
            slot => !slot.isActive
          ).length;

      },

      error: (err) => {

        this.loading = false;

        console.error(err);

      }

    });

  }

  onDateChange(event: Event) {

    const input =
      event.target as HTMLInputElement;

    const date = input.value;

    if (!date) {
      return;
    }

    if (!this.selectedDates.includes(date)) {
      this.selectedDates.push(date);
    }

    input.value = '';

  }

  removeDate(date: string) {

    this.selectedDates =
      this.selectedDates.filter(
        d => d !== date
      );

  }

  editSlot(slot: any) {

    this.editingSlotId = slot._id;

    this.slotForm.patchValue({

      startTime: slot.startTime,

      endTime: slot.endTime,

      duration: slot.duration

    });

  }

  saveSlot() {

    if (this.slotForm.invalid) {

      this.slotForm.markAllAsTouched();

      return;

    }

    const value =
      this.slotForm.getRawValue();

    const startTime =
      value.startTime!;

    const endTime =
      value.endTime!;

    const duration =
      Number(value.duration);

    if (startTime >= endTime) {

      alert(
        'End time must be greater than start time.'
      );

      return;

    }

    if (this.editingSlotId) {

      const updateData = {

        date:
          this.getEditingSlotDate(),

        startTime:
          startTime,

        duration:
          duration

      };

      this.slotService
        .updateSlot(
          this.editingSlotId,
          updateData
        )
        .subscribe({

          next: () => {

            alert(
              'Slot updated successfully.'
            );

            this.resetForm();

            this.loadSlots();

          },

          error: (err: any) => {

            alert(
              err.error?.message ||
              'Unable to update slot.'
            );

          }

        });

      return;

    }

    if (this.selectedDates.length === 0) {

      alert(
        'Please select at least one date.'
      );

      return;

    }

    const createData = {

      dates:
        this.selectedDates,

      startTime:
        startTime,

      endTime:
        endTime,

      duration:
        duration

    };

    this.loading = true;

    this.slotService
      .createSlot(createData)
      .subscribe({

        next: (response: any) => {

          this.loading = false;

          alert(
            response.message ||
            'Slots created successfully.'
          );

          this.resetForm();

          this.loadSlots();

        },

        error: (err: any) => {

          this.loading = false;

          alert(
            err.error?.message ||
            'Unable to create slots.'
          );

        }

      });

  }

  getEditingSlotDate(): string {

    const slot =
      this.slots.find(
        x => x._id === this.editingSlotId
      );

    if (!slot) {
      return '';
    }

    const date =
      new Date(slot.date);

    const year =
      date.getFullYear();

    const month =
      String(date.getMonth() + 1).padStart(2, '0');

    const day =
      String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }

  searchSlots() {

    const keyword =
      this.searchText
        .toLowerCase()
        .trim();

    this.filteredSlots =
      this.slots.filter(slot => {

        const startTime =
          slot.startTime?.toLowerCase() || '';

        const endTime =
          slot.endTime?.toLowerCase() || '';

        return (
          startTime.includes(keyword) ||
          endTime.includes(keyword)
        );

      });

  }

  confirmToggle(slot: any) {

    const action =
      slot.isActive
        ? 'Deactivate'
        : 'Activate';

    const confirmed =
      confirm(
        `Are you sure you want to ${action} this slot?`
      );

    if (!confirmed) {
      return;
    }

    this.slotService
      .toggleStatus(slot._id)
      .subscribe({

        next: () => {

          this.loadSlots();

        },

        error: (err: any) => {

          alert(
            err.error?.message ||
            'Unable to update slot status.'
          );

        }

      });

  }

  resetForm() {

    this.slotForm.reset({

      startTime: '',

      endTime: '',

      duration: 15

    });

    this.selectedDates = [];

    this.editingSlotId = '';

  }

}