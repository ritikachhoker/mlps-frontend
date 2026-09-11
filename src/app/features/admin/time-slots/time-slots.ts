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

  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();

  calendarDays: {
    date: Date;
    dateString: string;
    isCurrentMonth: boolean;
    isToday: boolean;
  }[] = [];

  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  weekDays = [
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
    'SUN'
  ];

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
    this.generateCalendar();
    this.loadSlots();
  }

  loadSlots(): void {

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

  generateCalendar(): void {

    const firstDay = new Date(
      this.currentYear,
      this.currentMonth,
      1
    );

    const lastDay = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0
    );

    let startDay = firstDay.getDay();

    startDay = startDay === 0 ? 6 : startDay - 1;

    const totalDays = lastDay.getDate();

    const previousMonthLastDay = new Date(
      this.currentYear,
      this.currentMonth,
      0
    ).getDate();

    this.calendarDays = [];

    for (let i = startDay - 1; i >= 0; i--) {

      const day = previousMonthLastDay - i;

      const date = new Date(
        this.currentYear,
        this.currentMonth - 1,
        day
      );

      this.calendarDays.push(
        this.createCalendarDay(date, false)
      );
    }

    for (let day = 1; day <= totalDays; day++) {

      const date = new Date(
        this.currentYear,
        this.currentMonth,
        day
      );

      this.calendarDays.push(
        this.createCalendarDay(date, true)
      );
    }

    let nextDay = 1;

    while (this.calendarDays.length < 42) {

      const date = new Date(
        this.currentYear,
        this.currentMonth + 1,
        nextDay
      );

      this.calendarDays.push(
        this.createCalendarDay(date, false)
      );

      nextDay++;
    }
  }

  createCalendarDay(
    date: Date,
    isCurrentMonth: boolean
  ) {

    return {
      date,
      dateString: this.formatDate(date),
      isCurrentMonth,
      isToday: this.isToday(date)
    };
  }

  previousMonth(): void {

    this.currentMonth--;

    if (this.currentMonth < 0) {

      this.currentMonth = 11;
      this.currentYear--;
    }

    this.generateCalendar();
  }

  nextMonth(): void {

    this.currentMonth++;

    if (this.currentMonth > 11) {

      this.currentMonth = 0;
      this.currentYear++;
    }

    this.generateCalendar();
  }

  goToToday(): void {

    const today = new Date();

    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();

    this.generateCalendar();
  }

  selectDate(dateString: string, isCurrentMonth: boolean): void {

    if (!isCurrentMonth) {
      return;
    }

    if (this.editingSlotId) {
      return;
    }

    const index =
      this.selectedDates.indexOf(dateString);

    if (index === -1) {

      this.selectedDates.push(dateString);

    } else {

      this.selectedDates.splice(index, 1);
    }

    this.selectedDates = [...this.selectedDates];
  }

  isDateSelected(dateString: string): boolean {

    return this.selectedDates.includes(dateString);
  }

  isToday(date: Date): boolean {

    const today = new Date();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  formatDate(date: Date): string {

    const year =
      date.getFullYear();

    const month =
      String(date.getMonth() + 1).padStart(2, '0');

    const day =
      String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  formatSelectedDate(date: string): string {

    const parts = date.split('-');

    if (parts.length !== 3) {
      return date;
    }

    const selectedDate = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    return selectedDate.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  removeDate(date: string): void {

    this.selectedDates =
      this.selectedDates.filter(
        selectedDate =>
          selectedDate !== date
      );
  }

  clearSelectedDates(): void {

    this.selectedDates = [];
  }

  editSlot(slot: any): void {

    this.editingSlotId = slot._id;

    this.slotForm.patchValue({

      startTime: slot.startTime,

      endTime: slot.endTime,

      duration: slot.duration
    });

    const slotDate =
      this.formatDate(new Date(slot.date));

    this.currentMonth =
      new Date(slot.date).getMonth();

    this.currentYear =
      new Date(slot.date).getFullYear();

    this.generateCalendar();
  }

  saveSlot(): void {

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

        startTime,

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

      startTime,

      endTime,

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

    return this.formatDate(
      new Date(slot.date)
    );
  }

  searchSlots(): void {

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

  confirmToggle(slot: any): void {

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

  resetForm(): void {

    this.slotForm.reset({

      startTime: '',

      endTime: '',

      duration: 15
    });

    this.selectedDates = [];

    this.editingSlotId = '';

    this.goToToday();
  }
}