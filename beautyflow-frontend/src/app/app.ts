import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatToolbarModule, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  mostrarLayout = false;
  nomeUsuario = '';

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.mostrarLayout = !e.url.includes('/login');
      this.nomeUsuario = localStorage.getItem('beautyflow_nome') || '';
    });
  }

  logout(): void {
    localStorage.removeItem('beautyflow_token');
    localStorage.removeItem('beautyflow_nome');
    this.router.navigate(['/login']);
  }
}