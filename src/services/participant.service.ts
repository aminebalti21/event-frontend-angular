import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  private apiUrl = 'http://localhost:3000/participants';
  baseUrltic='http://localhost:3000/tickets';
  constructor(private http: HttpClient) {}
  getGlobalStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
  getMyTickets(): Observable<any> {
    const token = localStorage.getItem('token'); // ✅ Correction : déclaration de la variable 'token'

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrltic}/my-tickets`, { headers });
  }
  registerForEvent(eventId: number, ticketType: string,userId:number): Observable<any> {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké localement
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Ajout du token dans les en-têtes
    });

    return this.http.post<any>(
      `${this.apiUrl}/${eventId}`,
      { ticketType ,userId},
      { headers }
    );
  }
}
