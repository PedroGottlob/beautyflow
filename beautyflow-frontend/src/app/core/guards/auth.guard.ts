import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const token = localStorage.getItem('beautyflow_token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  // Valida o token no backend
  return http.get(`${environment.apiUrl}/auth/validate`, {
    headers: { Authorization: `Bearer ${token}` }
  }).pipe(
    map(() => true),
    catchError(() => {
      localStorage.removeItem('beautyflow_token');
      localStorage.removeItem('beautyflow_nome');
      return of(router.createUrlTree(['/login']));
    })
  );
};