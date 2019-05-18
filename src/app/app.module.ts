import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FuelAddComponent } from './fuel/fuel-add/fuel-add.component';
import { ListComponent } from './fuel/list/list.component';
import { FuelListComponent } from './fuel/fuel-list/fuel-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FuelAddComponent,
    ListComponent,
    FuelListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
