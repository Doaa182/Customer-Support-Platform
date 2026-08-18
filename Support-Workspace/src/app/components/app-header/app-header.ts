import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css',
})
export class AppHeader {
  private authService = inject(AuthService);
  private router = inject(Router);

  role = input('Agent');

  darkMode = false;

  async signOut(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;

    document.documentElement.classList.toggle('dark', this.darkMode);
  }
}
