import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/dashboard`;

  getDashboard() {
    return this.http.get(this.api);
  }

}