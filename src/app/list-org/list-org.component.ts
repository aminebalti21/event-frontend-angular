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
  isorg: boolean = false;
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
          this.isorg = user.role === 'Organisateur';
          if (this.isorg) {
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
    editEvent(id: number): void {
      this.router.navigate([`/event/edit/${id}`]);
    }
    onLogout() {
      this.authService.logout(); // Appeler la méthode logout du service
    }
    oncree() {
      this.router.navigate(['/event-management']); // Naviguer vers la route cible
    }
    goToTargetchart() {
      this.router.navigate(['/chart']); // Naviguer vers la route cible
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
