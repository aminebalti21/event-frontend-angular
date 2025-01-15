import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule
import { AuthService } from '../../services/auth.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, ReactiveFormsModule],  // Ajouter ReactiveFormsModule
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  editForm: FormGroup;
  selectedUser: any = null;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private fb: FormBuilder,private router:Router) {
    this.editForm = this.fb.group({
      name: [''],
      email: [''],
      role: [''],
    });
  }

  ngOnInit(): void {
    this.checkAdminAccess();
  }

  // Vérifier si l'utilisateur est un admin
  checkAdminAccess(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        this.isAdmin = user.role === 'Admin';
        if (this.isAdmin) {
          this.loadUsers();
        } else {
          alert("Vous n'avez pas l'autorisation d'accéder à cette page.");
          this.router.navigate(['/participant']); // Rediriger vers la page des participants si ce n'est pas un admin
        }
      },
      (error) => {
        console.error('Erreur lors de la vérification du rôle', error);
      }
    );
  }

  // Charger les utilisateurs
  loadUsers(): void {
    this.authService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs', error);
      }
    );
  }

  // Modifier un utilisateur
  openEditForm(user: any): void {
    this.selectedUser = user;
    this.editForm.setValue({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }

  saveChanges(): void {
    if (this.selectedUser) {
      this.authService.updateUser(this.selectedUser.id, this.editForm.value).subscribe(
        () => {
          alert('Utilisateur mis à jour.');
          this.loadUsers();
          this.selectedUser = null;
        },
        (error) => {
          console.error('Erreur lors de la mise à jour', error);
        }
      );
    }
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.authService.deleteUser(id).subscribe(
        () => {
          alert('Utilisateur supprimé.');
          this.loadUsers();
        },
        (error) => {
          console.error('Erreur lors de la suppression', error);
        }
      );
    }
  }
}
