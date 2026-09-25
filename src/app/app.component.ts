import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from './auth/auth.service';

/**
 * Root shell: the navigation bar plus the routed page.
 */
@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  title = 'FuelManagementAngular';

  /** Signs out and returns to the login page. */
  logout() {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
