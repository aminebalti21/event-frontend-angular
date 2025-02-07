import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // URL de l'API d'authentification
  private eventApiUrl = 'http://localhost:3000/events';
  private apiUrl2 = 'http://localhost:3000/users/users';
  baseUrltic='http://localhost:3000/tickets'; // URL de l'API pour la gestion des événements
  private apiUrlp = 'http://localhost:3000/participants';

  constructor(private http: HttpClient, private router: Router) {}
  getMyTickets(): Observable<any> {
    return this.http.get(`${this.baseUrltic}/my-tickets`);
  }
  // Méthodes d'authentification
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
    
  }
  getEventById(eventId: string): Observable<any> {
    return this.http.get(`${this.eventApiUrl}/${eventId}`);
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
    if (role === 'Admin') {
      this.router.navigate(['/user']); // Rediriger vers la page de gestion des utilisateurs
    } else if (role === 'Organisateur') {
      this.router.navigate(['/event-management']); // Rediriger vers la gestion des événements
    } else {
      this.router.navigate(['/participant']); // Rediriger vers la page des participants
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
      this.router.navigate(['/login']); // Redirige vers login
      throw new Error('Utilisateur non authentifié.');
    }
  
    // Vérifie si le token est valide
    const decodedToken = this.decodeToken(token);
    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
      localStorage.removeItem('token'); // Supprime le token expiré
      this.router.navigate(['/login']); // Redirige
      throw new Error('Token expiré ou invalide.');
    }
  
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
  





  getUsers(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl2}`, { headers });
  }

  // Modifier un utilisateur
  updateUser(id: number, userData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl2}/${id}`, userData, { headers });
  }

  // Supprimer un utilisateur
  deleteUser(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl2}/${id}`, { headers });
  }






  getTicketsByType(): Observable<any> {
    return this.http.get<any>(`${this.baseUrltic}/tickets-by-type`);
  }

  // Récupérer le nombre de participants par événement
  getUsersPerEvent(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlp}/users-per-event`);
  }

  // Récupérer les meilleurs événements
  getTopEvents(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlp}/top-events`);
  }

  // Récupérer les tickets par statut
  getTicketsByStatus(): Observable<any> {
    return this.http.get<any>(`${this.baseUrltic}/tickets-by-status`);
  }


  
  
  
  
}
