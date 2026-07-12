import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private http = inject(HttpClient);

 private api = `${environment.apiUrl}/appointments`;

  createAppointment(data: any) {
    return this.http.post(this.api, data);
  }

 getAppointments() {
  return this.http.get(`${this.api}`);
}

approveAppointment(id: string) {
  return this.http.patch(`${this.api}/${id}/approve`, {});
}

rejectAppointment(id: string) {
  return this.http.patch(`${this.api}/${id}/reject`, {});
}

}