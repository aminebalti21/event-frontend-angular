// register.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { AuthService } from '../../services/auth.service';  // Assurez-vous que le service AuthService est importé
import { CommonModule } from '@angular/common';  // Importer CommonModule pour les fonctionnalités de base d'Angular
import { HttpClientModule } from '@angular/common/http';  // Pour l'HTTP, assurez-vous d'importer HttpClientModule

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],  // Ajouter les modules nécessaires
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user = { name: '', email: '', password: '', role: 'Participant' };  // Par défaut, le rôle est "Participant"
  error: string | null = null;

  constructor(private authService: AuthService) {}

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
      },
      error: (err) => {
        console.error("Erreur lors de l'inscription: ", err);
        this.error = err.error.message || "Une erreur est survenue.";
      },
    });
  }
  
}
