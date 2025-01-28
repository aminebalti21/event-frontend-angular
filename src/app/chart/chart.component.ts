import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { ParticipantService } from '../../services/participant.service';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  totalParticipants: any;  // Initialiser à 0, mais la valeur sera mise à jour
  totalEvents: any;  // Initialiser à 0
  totalPaid: any;  // Initialiser à 0
  
  constructor(private authService: AuthService, private ParticipantService:ParticipantService) {}
 
  ngOnInit(): void {
    this.loadGlobalStats;
    this.loadTicketsByType();
    this.loadUsersPerEvent();
    this.loadTopEvents();
    this.loadTicketsByStatus();
  }

  loadTicketsByType(): void {
    this.authService.getTicketsByType().subscribe({
      next: (data) => {
        const types = data.map((d: any) => d.type);
        const counts = data.map((d: any) => d.count);

        new Chart('ticketsByTypeChart', {
          type: 'pie',
          data: {
            labels: types,
            datasets: [
              {
                label: 'Tickets par type',
                data: counts,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              },
            ],
          },
        });
      },
      error: (err) => console.error('Erreur chargement tickets par type :', err),
    });
  }

  loadUsersPerEvent(): void {
    this.authService.getUsersPerEvent().subscribe({
      next: (data) => {
        // Vérifiez si des données sont reçues
        if (!data || data.length === 0) {
          console.warn('Aucune donnée reçue pour les utilisateurs par événement.');
          return;
        }
  
        // Validez et mappez les données
        const titles = data.map((d: any) => d.Event?.title || 'Titre manquant');
        const counts = data.map((d: any) => d.userCount || 0);
  
        // Vérifiez les données mappées
        console.log('Données titres:', titles);
        console.log('Données counts:', counts);
  
        // Créez le graphique
        new Chart('usersPerEventChart', {
          type: 'bar',
          data: {
            labels: titles,
            datasets: [
              {
                label: 'Participants par événement',
                data: counts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
      error: (err) => {
        console.error('Erreur chargement participants par événement :', err);
      },
    });
  }
  

  loadTopEvents(): void {
    this.authService.getTopEvents().subscribe({
      next: (data) => {
        const titles = data.map((d: any) => d.title);
        const counts = data.map((d: any) => d.count);

        new Chart('topEventsChart', {
          type: 'bar',
          data: {
            labels: titles,
            datasets: [
              {
                label: 'Top événements',
                data: counts,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
      error: (err) => console.error('Erreur chargement top événements :', err),
    });
  }

  loadTicketsByStatus(): void {
    this.authService.getTicketsByStatus().subscribe({
      next: (data) => {
        const statuses = data.map((d: any) => d.status);
        const counts = data.map((d: any) => d.count);

        new Chart('ticketsByStatusChart', {
          type: 'doughnut',
          data: {
            labels: statuses,
            datasets: [
              {
                label: 'Statut des tickets',
                data: counts,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
              },
            ],
          },
        });
      },
      error: (err) => console.error('Erreur chargement statuts des tickets :', err),
    });
  }


  loadGlobalStats(): void {
    this.ParticipantService.getGlobalStats().subscribe({
      next: (stats) => {
        console.log('Données reçues du backend :', stats); // Debug
        this.totalParticipants = stats.totalParticipants;
        this.totalEvents = stats.totalEvents;
        this.totalPaid = stats.totalPaid;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des statistiques globales :', err);
      },
    });
  }
  
}