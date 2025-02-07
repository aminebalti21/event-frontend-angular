import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { ParticipantService } from '../../services/participant.service';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,MatCardModule, ReactiveFormsModule,MatOptionModule,
    MatFormFieldModule, MatInputModule,MatIconModule,MatTableModule,MatSelectModule,],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.scss'
})
export class MyTicketsComponent implements OnInit {
  tickets: any[] = [];
  error: string | null = null;

  constructor(private participantService: ParticipantService , private router: Router) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.participantService.getMyTickets().subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tickets :', err);
        this.error = 'Impossible de charger les tickets.';
      }
    });
  }
  
  goBack(): void {
    this.router.navigate(['/participant']); // Redirige vers la page de liste des événements
  }
}