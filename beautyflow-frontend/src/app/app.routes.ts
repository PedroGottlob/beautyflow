import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'clientes',
    canActivate: [authGuard],
    loadComponent: () => import('./features/clientes/clientes').then(m => m.ClientesComponent)
  },
  {
    path: 'profissionais',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profissionais/profissionais').then(m => m.ProfissionaisComponent)
  },
  {
    path: 'servicos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/servicos/servicos').then(m => m.ServicosComponent)
  },
  {
    path: 'agendamentos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/agendamentos/agendamentos').then(m => m.AgendamentosComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];