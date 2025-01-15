import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-list-org',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './list-org.component.html',
  styleUrl: './list-org.component.scss'
})
export class ListOrgComponent implements OnInit {
  events: any[] = [];
  error: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }
  getPhotoUrl(photoPath: string | null): string {
    if (!photoPath) {
      return 'assets/default-image.jpg'; // Chemin de l'image par défaut
    }
    return `http://localhost:3000/${photoPath}`; // Remplacez par l'URL de votre serveur backend
  }
  

  // Charger tous les événements
  loadEvents(): void {
    this.authService.getEvents().subscribe({
      next: (data) => {
        console.log("Événements chargés : ", data); // Inspecter les données
        this.events = data;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des événements.';
        console.error(err);
      },
    });}
    editEvent(id: number): void {
      this.router.navigate([`/event/edit/${id}`]);
    }
    onLogout() {
      this.authService.logout(); // Appeler la méthode logout du service
    }
    // Supprimer un événement
    deleteEvent(id: number): void {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
        this.authService.deleteEvent(id).subscribe({
          next: () => {
            this.loadEvents();
          },
          error: (err) => {
            this.error = 'Erreur lors de la suppression de l\'événement.';
            console.error(err);
          },
        });
      }
    }
}
