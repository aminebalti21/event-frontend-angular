import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/payments'; // Assurez-vous que cette URL correspond à celle de votre backend

  constructor(private http: HttpClient) {}

  // Création d'un paiement PayPal
  createPaymentIntent(amount: number, description: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/payment`, { amount, description });
  }

  // Finalisation de l'achat et création d'un ticket
  purchaseTicket(ticketData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/purchase`, ticketData);
  }
}
