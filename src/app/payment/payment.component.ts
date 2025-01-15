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
export class PaymentComponent {
  constructor(private paymentService: PaymentService) {}

  makePayment() {
    this.paymentService.createOrder(10.00, 'USD', 'Achat de billet').subscribe({
      next: (response) => {
        // Redirection vers PayPal pour l'approbation
        window.location.href = response.approvalUrl;
      },
      error: (error) => {
        console.error('Erreur lors de la création du paiement:', error);
      },
    });
  }
}
