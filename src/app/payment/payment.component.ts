import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  eventId!: string;
  userId!: string;
  ticketType!: string;
  price!: number;

  constructor(private route: ActivatedRoute, private router: Router,private PaymentService:PaymentService) {}

  ngOnInit(): void {
    // Récupérer les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.eventId = params['eventId'];
      this.userId = params['userId'];
      this.ticketType = params['ticketType'];
      

      // Vérification si les paramètres sont bien présents
      if (!this.eventId || !this.userId || !this.ticketType ) {
        console.error('Paramètres manquants :', {
          eventId: this.eventId,
          userId: this.userId,
          ticketType: this.ticketType,
          
        });
        alert('Paramètres manquants, redirigez l\'utilisateur vers la page d\'inscription.');
      }
    });
  }

  pay(): void {
    if (!this.eventId || !this.userId || !this.ticketType ) {
      console.error('Erreur de paiement : Paramètres manquants');
      return;
    }

    // Logique pour le paiement, par exemple, appeler PaymentService pour créer la session de paiement
    this.PaymentService.createCheckoutSession(this.ticketType, this.eventId, this.userId)
      .then(() => {
        // Enregistrer le ticket après le paiement réussi
        const ticketData = {
          eventId: this.eventId,
          userId: this.userId,
          type: this.ticketType,
          status: 'paid',
          price: this.price,
          purchasedAt: new Date(),
        };

        this.PaymentService.saveTicket(ticketData)
          .then(response => {
            console.log('Ticket enregistré avec succès.', response);
          })
          .catch(error => {
            console.error('Erreur lors de l\'enregistrement du ticket :', error);
          });
      })
      .catch(error => {
        console.error('Erreur lors de la création de la session de paiement :', error);
      });
  }
}
