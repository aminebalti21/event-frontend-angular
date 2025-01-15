import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { AuthService } from '../../services/auth.service';  // Assurez-vous que le service AuthService est importé
import { CommonModule } from '@angular/common';  // Importer CommonModule pour les fonctionnalités de base d'Angular
import { HttpClientModule } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register-participant',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './register-participant.component.html',
  styleUrl: './register-participant.component.scss'
})
export class RegisterParticipantComponent {
  
    user = { name: '', email: '', password: '', role: 'Participant' };  // Par défaut, le rôle est "Participant"
    error: string | null = null;
  
    constructor(private authService: AuthService ,private router:Router) {}
  
    onSubmit() {
      // Vérifiez si les champs sont valides avant de soumettre
      if (!this.user.name || !this.user.email || !this.user.password) {
        alert("Tous les champs doivent être remplis.");
        return;
      }
    
      // Vérifiez si l'email est valide
      const emailPattern = /\S+@\S+\.\S+/;
      if (!emailPattern.test(this.user.email)) {
        alert("L'email n'est pas valide.");
        return;
      }
    
      this.authService.register(this.user).subscribe({
        next: () => {
          alert("Inscription réussie !");
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error("Erreur lors de l'inscription: ", err);
          this.error = err.error.message || "Une erreur est survenue.";
        },
      });
    }
    
  }

