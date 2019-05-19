import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { FuelAddComponent } from './fuel/fuel-add/fuel-add.component';
import { FuelListComponent } from './fuel/fuel-list/fuel-list.component';
import { FuelHomeComponent } from './fuel/fuel-home/fuel-home.component';

const routes: Routes = [
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
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }





