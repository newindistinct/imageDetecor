import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'detec-image',
    pathMatch: 'full',
  },
  {
    path: 'detec-image',
    loadComponent: () => import('./detec-image/detec-image.page').then( m => m.DetecImagePage)
  },
];
