import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {
  eventId: number | null = null;
  eventData: any = {
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    maxCapacity: '',
    type: '',
    theme: '',
  };
  selectedFile: File | null = null;  // Stocker le fichier sélectionné

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventId) {
      this.authService.getEvents().subscribe((events) => {
        const event = events.find((e: any) => e.id === this.eventId);
        if (event) {
          this.eventData = event;
        }
      });
    }
  }
  goToTarget() {
    this.router.navigate(['/list']); // Naviguer vers la route cible
  }

  // Gestion du fichier sélectionné
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Soumettre le formulaire
  onSubmit() {
    if (this.eventId) {
      const formData = new FormData();
      formData.append('title', this.eventData.title);
      formData.append('description', this.eventData.description);
      formData.append('location', this.eventData.location);
      formData.append('date', this.eventData.date);
      formData.append('time', this.eventData.time);
      formData.append('maxCapacity', this.eventData.maxCapacity.toString());
      formData.append('type', this.eventData.type);
      formData.append('theme', this.eventData.theme);

      // Si une nouvelle photo est sélectionnée, l'ajouter au formData
      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }

      this.authService.updateEvent(this.eventId, formData).subscribe({
        next: () => {
          alert('Événement mis à jour avec succès !');
          this.router.navigate(['/event-management']);
        },
        error: (err) => console.error('Erreur lors de la mise à jour :', err),
      });
    }
  }
}
