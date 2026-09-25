import { Routes } from '@angular/router';

import { FuelAddComponent } from './fuel/fuel-add/fuel-add.component';
import { FuelHomeComponent } from './fuel/fuel-home/fuel-home.component';
import { FuelListComponent } from './fuel/fuel-list/fuel-list.component';
import { LoginComponent } from './login/login.component';

/** Top-level routes of the application. */
export const routes: Routes = [
  {
    path: '',
    component: FuelHomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'fms',
    component: FuelHomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: FuelHomeComponent
  },
  {
    path: 'add',
    component: FuelAddComponent
  },
  {
    path: 'list',
    component: FuelListComponent
  }
];
