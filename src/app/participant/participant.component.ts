import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ParticipantService } from '../../services/participant.service';
import { PaymentComponent } from '../payment/payment.component';

@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, PaymentComponent],
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.scss']
})
export class ParticipantComponent implements OnInit {
  events: any[] = [];
  error: string | null = null;
  userId: number | null = null;  // Ajout de la variable pour stocker l'ID de l'utilisateur

  constructor(
    private authService: AuthService,
    private participantService: ParticipantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur connecté et son ID
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.userId = user.id; // Récupérer l'ID de l'utilisateur connecté
        console.log('Utilisateur connecté :', user);
        this.loadEvents(); // Charger les événements après avoir récupéré l'utilisateur
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'utilisateur :', err);
      }
    });
  }

  // Fonction pour récupérer l'URL de la photo de l'événement
  getPhotoUrl(photoPath: string | null): string {
    if (!photoPath) {
      return 'assets/default-image.jpg'; // Chemin de l'image par défaut
    }
    return `http://localhost:3000/${photoPath}`; // Remplacer par l'URL de votre serveur backend
  }
  onLogout() {
    this.authService.logout(); // Appeler la méthode logout du service
  }
  // Charger tous les événements
  loadEvents(): void {
    this.authService.getEvents().subscribe({
      next: (data) => {
        console.log("Événements chargés : ", data);
        this.events = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des événements.';
        console.error(err);
      }
    });
  }

  // Fonction pour s'inscrire à un événement
  register(eventId: number, ticketType: string): void {
    if (this.userId === null) {
      alert("Utilisateur non authentifié !");
      return;
    }

    // Passer l'ID de l'utilisateur et le type de ticket
    this.participantService.registerForEvent(eventId, ticketType, this.userId).subscribe({
      next: (response) => {
        alert(`Inscription réussie à l'événement avec un billet ${ticketType}!`);
        this.router.navigate(['/payment'], {
          queryParams: {
            ticketType: response.ticketType,  // Ajouter le type de ticket
            amount: response.amount,  // Ajouter le montant
            eventId: eventId,  // Ajouter l'ID de l'événement
            userId: this.userId  // Ajouter l'ID de l'utilisateur
          }
        });

        // Mettre à jour la capacité de l'événement
        this.events = this.events.map((event) =>
          event.id === eventId ? { ...event, maxCapacity: event.maxCapacity - 1 } : event
        );
      },
      error: (err) => {
        alert('Erreur lors de l\'inscription : ' + err.error.error);
        console.error(err);
      }
    });
  }
}
