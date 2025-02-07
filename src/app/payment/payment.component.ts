import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatLineModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule,ReactiveFormsModule,MatCardModule,MatOptionModule,
    MatFormFieldModule, MatInputModule,MatIconModule,MatTableModule,MatSelectModule,MatListModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  eventId!: string;
  userId!: string;
  ticketType!: string;
  
  amount!: number;

  constructor(private route: ActivatedRoute, private router: Router,private PaymentService:PaymentService,private AuthService:AuthService) {}

  ngOnInit(): void {
    // Récupérer les queryParams
    this.route.queryParams.subscribe(params => {
      this.ticketType = params['ticketType'];
      this.amount = params['amount'];
      this.eventId = params['eventId'];
      this.userId = params['userId'];
      
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
          price: this.amount,
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
  goBack(): void {
    this.router.navigate(['/participant']); // Redirige vers la page de liste des événements
  }
  

}
