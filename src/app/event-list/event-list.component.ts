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
  ispart: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.loadEvents();
    this.checkAdminAccess();
  }
  checkAdminAccess(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      // Si le token n'existe pas, redirige l'utilisateur vers le login
      this.router.navigate(['/login']);
    } else {
      // Si un token existe, on récupère l'utilisateur pour vérifier son rôle
      this.authService.getCurrentUser().subscribe(
        (user) => {
          this.ispart = user.role === 'participant';
          if (this.ispart) {
            this.loadEvents();
          } else {
            alert("Vous n'avez pas l'autorisation d'accéder à cette page.");
            this.router.navigate(['/login']); // Si ce n'est pas un admin, redirige vers le login
          }
        },
        (error) => {
          console.error('Erreur lors de la vérification du rôle', error);
          this.router.navigate(['/login']); // En cas d'erreur, redirige vers le login
        }
      );
    }}
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
