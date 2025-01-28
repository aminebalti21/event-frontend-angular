import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss'],
})
export class EventManagementComponent implements OnInit {
  events: any[] = [];
  newEvent = { title: '', description: '', date: '', time: '', location: '', maxCapacity: 0, type: '', theme: '' };
  selectedFile: File | null = null; // Nouveau champ pour stocker le fichier sélectionné
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

  // Gestion du fichier sélectionné
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Créer un nouvel événement
  createEvent(): void {
    if (!this.newEvent.title || !this.newEvent.description || !this.newEvent.date || !this.newEvent.time || !this.newEvent.location || this.newEvent.maxCapacity <= 0 || !this.newEvent.type || !this.newEvent.theme) {
      this.error = 'Tous les champs doivent être remplis.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.newEvent.title);
    formData.append('description', this.newEvent.description);
    formData.append('date', this.newEvent.date);
    formData.append('time', this.newEvent.time);
    formData.append('location', this.newEvent.location);
    formData.append('maxCapacity', this.newEvent.maxCapacity.toString());
    formData.append('type', this.newEvent.type);
    formData.append('theme', this.newEvent.theme);

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    this.authService.createEvent(formData).subscribe({
      next: () => {
        this.loadEvents(); // Recharger les événements après création
        this.newEvent = { title: '', description: '', date: '', time: '', location: '', maxCapacity: 0, type: '', theme: '' };
        this.selectedFile = null;
        this.router.navigate(['/list'])
      },
      error: (err) => {
        this.error = 'Erreur lors de la création de l\'événement.';
        console.error(err);
      },
    });
  }

  // Modifier un événement

  onLogout() {
    this.authService.logout(); // Appeler la méthode logout du service
  }
  // Supprimer un événement
  goToTarget() {
    this.router.navigate(['/list']); // Naviguer vers la route cible
  }
}
