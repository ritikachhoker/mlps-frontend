import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SlotService } from '../../../core/services/slot.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-time-slots',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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

  slotForm = this.fb.group({
    startTime: ['', Validators.required],
    endTime: ['', Validators.required],
    duration: [15, Validators.required]
  });

  ngOnInit(): void {
    this.loadSlots();
  }
  editSlot(slot: any) {

  this.editingSlotId = slot._id;

  this.slotForm.patchValue({

    startTime: slot.startTime,

    endTime: slot.endTime,

    duration: slot.duration

  });

}
  loadSlots() {

  this.loading = true;

  this.slotService.getAllSlots().subscribe({

    next: (response: any) => {

      this.loading = false;

      this.slots = response.data;

      this.filteredSlots = [...this.slots];

      this.activeSlots =
        this.slots.filter(x => x.isActive).length;

      this.inactiveSlots =
        this.slots.filter(x => !x.isActive).length;

    },

    error: (err) => {

      this.loading = false;

      console.error(err);

    }

  });

}

  saveSlot() {

  if(this.slotForm.invalid){

    return;

  }

  const value = this.slotForm.getRawValue();

if (value.startTime! >= value.endTime!) {

  alert("End time must be greater than Start time.");

  return;

}

  if(this.editingSlotId){

    this.slotService
  .updateSlot(this.editingSlotId,value)
  .subscribe({

    next:()=>{

      alert("Slot updated successfully.");

      this.resetForm();

      this.loadSlots();

    },

    error:(err:any)=>{

      alert(err.error?.message || "Unable to update slot.");

    }

  });

  }

  else{

    this.slotService
  .createSlot(value)
  .subscribe({

    next:()=>{

      alert("Slot saved successfully.");

      this.resetForm();

      this.loadSlots();

    },

    error:(err:any)=>{

      alert(err.error?.message || "Unable to save slot.");

    }

  });

  }

}
searchSlots() {

  const keyword = this.searchText.toLowerCase();

  this.filteredSlots = this.slots.filter(slot =>

    slot.startTime.toLowerCase().includes(keyword) ||

    slot.endTime.toLowerCase().includes(keyword)

  );

}
  confirmToggle(slot: any) {

  const action = slot.isActive

    ? 'Deactivate'

    : 'Activate';

  const confirmed = confirm(

    `Are you sure you want to ${action} this slot?`

  );

  if (!confirmed) return;

  this.slotService

    .toggleStatus(slot._id)

    .subscribe({

      next: () => {

        this.loadSlots();

      }

    });

}
resetForm() {

  this.slotForm.reset({
    duration: 15
  });

  this.editingSlotId = '';

}

}