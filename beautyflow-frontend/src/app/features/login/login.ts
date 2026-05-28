import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatFormFieldModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <div class="logo">
          <span class="logo-icon">✂️</span>
          <h1>BeautyFlow</h1>
          <p>Sistema de Agendamento</p>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>E-mail</mat-label>
          <input matInput type="email" [(ngModel)]="email" placeholder="seu@email.com" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Senha</mat-label>
          <input matInput type="password" [(ngModel)]="password" placeholder="••••••••" />
        </mat-form-field>

        <div *ngIf="erro" class="erro">{{ erro }}</div>

        <button mat-raised-button color="primary" class="full-width" (click)="entrar()" [disabled]="carregando">
          {{ carregando ? 'Aguarde...' : 'Entrar' }}
        </button>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #6a1b9a, #ab47bc);
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 2rem;
    }
    .logo {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-icon { font-size: 3rem; }
    .logo h1 { margin: 0.5rem 0 0.25rem; color: #6a1b9a; font-size: 1.8rem; }
    .logo p { margin: 0; color: #888; }
    .full-width { width: 100%; margin-bottom: 1rem; }
    .erro { color: #e53935; font-size: 0.85rem; margin-bottom: 1rem; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  erro = '';
  carregando = false;

  constructor(private router: Router, private http: HttpClient) {}

  entrar(): void {
    if (!this.email || !this.password) {
      this.erro = 'Preencha e-mail e senha';
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.http.post<any>(`${environment.apiUrl}/auth/login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        localStorage.setItem('beautyflow_token', response.token);
        localStorage.setItem('beautyflow_nome', response.name);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.erro = 'E-mail ou senha inválidos';
        this.carregando = false;
      }
    });
  }
}