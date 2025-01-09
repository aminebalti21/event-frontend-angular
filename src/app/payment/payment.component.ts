import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
declare var paypal: any;  // Assurez-vous que Paypal est correctement déclaré dans votre projet.

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {

  eventId: number = 1; // Exemple d'ID d'événement
  userId: number = 1; // Exemple d'ID utilisateur
  ticketType: string = 'Standard'; // Type de billet
  amount: number = 1000; // Montant en cents (ex : 10.00$ -> 1000)
  description: string = 'Billet pour un événement';

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    // Charger le script PayPal avec votre client ID
    const script = document.createElement('script');
    script.src = 'https://www.paypal.com/sdk/js?client-id=AaoAiRjuXHF7LH0KY9Pilzd_dbArjsqDzoIfNTLwzmpPaziNs5dxlWtTUIOobAGrHvK5Vc-Pn2JyQRKH&currency=USD';  // Remplacez avec votre vrai client-id
    script.onload = this.setupPaypalButton.bind(this);
    document.body.appendChild(script);
  }

  setupPaypalButton() {
    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        if (!this.amount || this.amount <= 0) {
          console.error('Montant invalide', this.amount);
          alert('Le montant est invalide.');
          return Promise.reject('Montant invalide.');
        }
      
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: (this.amount / 100).toFixed(2), // Convertir cents en dollars (USD)
              currency_code: 'USD'
            }
          }]
        }).catch((error: any) => {
          console.error('Erreur lors de la création de la commande :', error);
          alert('Erreur lors de la création de la commande.');
        });
      },
      
      
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.paymentService.purchaseTicket({
            eventId: this.eventId,
            userId: this.userId,
            ticketType: this.ticketType,
            amount: this.amount
          }).subscribe({
            next: () => alert('Paiement réussi ! Votre billet a été créé.'),
            error: (err) => alert('Erreur lors de la création du billet.')
          });
        });
      }
    }).render('#paypal-button-container');
  }
}
