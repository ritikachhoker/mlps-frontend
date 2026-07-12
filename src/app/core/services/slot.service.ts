import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SlotService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/slots`;

  getAllSlots() {
    return this.http.get(this.api);
  }

  getAvailableSlots(date: string) {
    return this.http.get(`${this.api}/available?date=${date}`);
  }

  createSlot(data: any) {
    return this.http.post(this.api, data);
  }

  updateSlot(id: string, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  toggleStatus(id: string) {
    return this.http.patch(`${this.api}/${id}/toggle-status`, {});
  }

}