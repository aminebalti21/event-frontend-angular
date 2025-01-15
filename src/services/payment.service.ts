import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private backendUrl = 'http://localhost:3000/payments'; // URL du backend Node.js

  constructor(private http: HttpClient) {}

  createOrder(amount: number, currency: string = 'USD', description?: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/create-order`, { amount, currency, description });
  }

  captureOrder(orderId: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/capture-order`, { orderId });
  }
}
