import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/slots`;


  // Get all slots
  getAllSlots() {
    return this.http.get(this.api);
  }


  // Get available slots for selected date
  getAvailableSlots(date: string) {
    return this.http.get(
      `${this.api}/available?date=${date}`
    );
  }


  // Create slots for selected dates
  createSlot(data: {
    dates: string[];
    startTime: string;
    endTime: string;
    duration: number;
  }) {

    return this.http.post(
      this.api,
      data
    );
  }


  // Update existing slot
  updateSlot(
    id: string,
    data: {
      date: string;
      startTime: string;
      duration: number;
    }
  ) {

    return this.http.put(
      `${this.api}/${id}`,
      data
    );
  }


  // Activate / Deactivate slot
  toggleStatus(id: string) {

    return this.http.patch(
      `${this.api}/${id}/toggle-status`,
      {}
    );
  }

}