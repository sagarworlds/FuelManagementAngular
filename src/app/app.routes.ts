import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { FuelAddComponent } from './fuel/fuel-add/fuel-add.component';
import { FuelHomeComponent } from './fuel/fuel-home/fuel-home.component';
import { FuelListComponent } from './fuel/fuel-list/fuel-list.component';
import { LoginComponent } from './login/login.component';

/** Top-level routes of the application; everything except login requires a signed-in user. */
export const routes: Routes = [
  {
    path: '',
    component: FuelHomeComponent,
    pathMatch: 'full',
    canActivate: [authGuard]
  },
  {
    path: 'fms',
    component: FuelHomeComponent,
    pathMatch: 'full',
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: FuelHomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'add',
    component: FuelAddComponent,
    canActivate: [authGuard]
  },
  {
    path: 'list',
    component: FuelListComponent,
    canActivate: [authGuard]
  }
];
