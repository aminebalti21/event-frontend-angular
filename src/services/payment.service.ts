import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private stripePromise = loadStripe('pk_test_51QbkFwP8MTu6V2mmV9qBqnmf1DoUsDs3zgzFMSShopWjwySHa3b35DA9nUKCTgiseVGJksuymRAGaIb78TtoLdZW00xNfZp8nc');

  constructor(private http: HttpClient) {}
  async saveTicket(ticketData: any) {
    try {
      return await firstValueFrom(
        this.http.post('http://localhost:3000/payments/save-ticket', ticketData)
      );
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du ticket :', error);
      throw error;
    }
  }

  async createCheckoutSession(ticketType: string, eventId: string, userId: string) {
    const stripe = await this.stripePromise;
  
    const response = await this.http
      .post<{ url: string }>('http://localhost:3000/payments/create-checkout-session', {
        eventId,
        userId,
        ticketType,
      })
      .toPromise();
  
    if (response && stripe) {
      window.location.href = response.url; // Redirection vers Stripe.
    }
  }
}  