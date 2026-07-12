import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SlotService } from '../../../core/services/slot.service';

@Component({
  selector: 'app-time-slots',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './time-slots.html',
  styleUrl: './time-slots.css'

})
export class TimeSlots implements OnInit {

  private fb = inject(FormBuilder);
  private slotService = inject(SlotService);
   editingSlotId = '';
  slots: any[] = [];

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
    this.slotService.getAllSlots().subscribe({
      next: (response: any) => {
        this.slots = response.data;
      },
      error: (err) => console.error(err)
    });
  }

  saveSlot() {

  if(this.slotForm.invalid){

    return;

  }

  const value = this.slotForm.getRawValue();

  if(this.editingSlotId){

    this.slotService
      .updateSlot(this.editingSlotId,value)
      .subscribe({

        next:()=>{

          this.slotForm.reset({
            duration:15
          });

          this.editingSlotId='';

          this.loadSlots();

        }

      });

  }

  else{

    this.slotService
      .createSlot(value)
      .subscribe({

        next:()=>{

          this.slotForm.reset({
            duration:15
          });

          this.loadSlots();

        }

      });

  }

}
  toggle(slotId: string) {
    this.slotService.toggleStatus(slotId)
      .subscribe(() => this.loadSlots());
  }

}