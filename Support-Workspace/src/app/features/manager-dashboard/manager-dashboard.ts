import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-manager-dashboard',
  imports: [],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css',
})
export class ManagerDashboard {
  private authService = inject(AuthService);
  private router = inject(Router);

  async signOut(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}
