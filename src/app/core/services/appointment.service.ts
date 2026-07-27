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

 getAppointments(
  page = 1,
  limit = 10,
  search = '',
  status = '',
  date = ''
) {

  let url = `${this.api}?page=${page}&limit=${limit}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  if (status && status !== 'ALL') {
    url += `&status=${status}`;
  }

  if (date) {
    url += `&date=${date}`;
  }

  return this.http.get(url);

}

approveAppointment(id: string) {
  return this.http.patch(`${this.api}/${id}/approve`, {});
}

rejectAppointment(id: string) {
  return this.http.patch(`${this.api}/${id}/reject`, {});
}
rescheduleAppointment(
  bookingId: string,
  mobile: string,
  newDate: string,
  newSlotId: string
) {

  return this.http.patch(
    `${this.api}/${bookingId}/reschedule`,
    {
      mobile,
      newDate,
      newSlotId
    }
  );

}
cancelAppointment(
  bookingId: string,
  mobile: string,
  cancellationReason: string
) {

  return this.http.patch(
    `${this.api}/${bookingId}/cancel`,
    {
      mobile,
      cancellationReason
    }
  );

}

}