import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit{
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
    viewEventDetails(eventId: number): void {
      this.router.navigate([`/event-details/${eventId}`]);
    }
}
