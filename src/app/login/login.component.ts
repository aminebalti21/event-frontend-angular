import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = { name: '', password: '' };
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        // Appeler handleLoginResponse pour gérer la redirection en fonction du rôle
        this.authService.handleLoginResponse(res);
      },
      error: (err) => {
        this.error = err.error.message || 'Une erreur est survenue.';
      },
    });
  }
  goToTarget() {
    this.router.navigate(['/register-participant']); // Naviguer vers la route cible
  }
}
