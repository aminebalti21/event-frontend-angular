import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // URL de l'API d'authentification
  private eventApiUrl = 'http://localhost:3000/events'; // URL de l'API pour la gestion des événements

  constructor(private http: HttpClient, private router: Router) {}

  // Méthodes d'authentification
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
    
  }

  // Méthodes pour la gestion des événements
  createEvent(event: any): Observable<any> {
    const headers = this.getAuthHeaders(); // Récupérer les en-têtes avec le token
    return this.http.post(`${this.eventApiUrl}/create`, event, { headers });
  }

  getEvents(): Observable<any> {
    return this.http.get(`${this.eventApiUrl}`); // Les événements publics n'ont pas besoin d'authentification
  }

  updateEvent(id: number, event: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.eventApiUrl}/${id}`, event, { headers });
  }

  deleteEvent(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.eventApiUrl}/${id}`, { headers });
  }

  // Nouvelle méthode pour récupérer l'utilisateur connecté
  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion si le token est manquant
      throw new Error('Utilisateur non authentifié.');
    }

    const decodedToken = this.decodeToken(token);
    if (!decodedToken) {
      throw new Error('Token invalide.');
    }

    return of(decodedToken); // Retourner l'utilisateur (ID, rôle, etc.)
  }

  // Méthode pour gérer la réponse de connexion
  handleLoginResponse(response: any): void {
    // Sauvegarder le token dans localStorage
    localStorage.setItem('token', response.token);

    // Décoder le token pour obtenir le rôle
    const decodedToken = this.decodeToken(response.token);
    const role = decodedToken.role;

    // Rediriger en fonction du rôle
    if (role === 'Admin' || role === 'Organisateur') {
      this.router.navigate(['/event-management']); // Rediriger vers la page de gestion des événements
    } else {
      this.router.navigate(['/participant']); // Rediriger vers un autre tableau de bord ou page par défaut
    }
  }

  logout(): void {
    // Supprimer le token de localStorage
    localStorage.removeItem('token');

    // Rediriger l'utilisateur vers la page de login
    this.router.navigate(['/login']);
  }

  // Méthode pour décoder le token JWT
  private decodeToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]); // Décodage de la partie payload du JWT
      return JSON.parse(payload); // Retourne l'objet décodé
    } catch (e) {
      return null;
    }
  }

  // Méthode pour récupérer les en-têtes d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']); // Rediriger si pas de token
      throw new Error('Utilisateur non authentifié.');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
