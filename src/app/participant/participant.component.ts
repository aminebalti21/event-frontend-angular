import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ParticipantService } from '../../services/participant.service';
import { PaymentComponent } from '../payment/payment.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-participant',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,MatIconModule],
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.scss']
})
export class ParticipantComponent implements OnInit {
  events: any[] = [];
  filteredEvents: any[] = [];
  searchTerm: string = '';
  error: string | null = null;
  userId: number | null = null;

  constructor(
    private authService: AuthService,
    private participantService: ParticipantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.loadEvents();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l\'utilisateur :', err);
      }
    });
  }

  loadEvents(): void {
    this.authService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.filteredEvents = data; // Initialize filteredEvents with all events
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des événements.';
        console.error(err);
      }
    });
  }

  filterEvents(): void {
    if (!this.searchTerm) {
      this.filteredEvents = this.events;
    } else {
      this.filteredEvents = this.events.filter(event =>
        event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        event.theme.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  register(eventId: number, ticketType: string): void {
    if (this.userId === null) {
      alert("Utilisateur non authentifié !");
      return;
    }
  
    this.participantService.registerForEvent(eventId, ticketType, this.userId).subscribe({
      next: (response) => {
        alert(`Inscription réussie pour le billet ${ticketType}!`);
        // Redirection vers la page de paiement
        this.router.navigate(['/payment'], {
          queryParams: {
            ticketType: response.ticketType,
            amount: response.amount, // Ajouter le prix
            eventId: eventId,
            userId: this.userId
          }
        });
      },
      error: (err) => {
        alert('Erreur lors de l\'inscription : ' + err.error.error);
        console.error(err);
      }
    });
  }

  getPhotoUrl(photoPath: string | null): string {
    if (!photoPath) {
      return 'assets/default-image.jpg'; // Chemin de l'image par défaut
    }
    return `http://localhost:3000/${photoPath}`; // Remplacer par l'URL de votre serveur backend
  }

  onLogout() {
    this.authService.logout(); // Appeler la méthode logout du service
  }

  scrollToEvents(): void {
    const element = document.getElementById('events');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  scrollToacc(): void {
    const element = document.getElementById('acc');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  scrollTotesto(): void {
    const element = document.getElementById('testo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }


  scrollToaide(): void {
    const element = document.getElementById('aide');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  viewMyTickets(): void {
    this.router.navigate(['/my-tickets']); // Redirection vers la page des tickets
  }


}