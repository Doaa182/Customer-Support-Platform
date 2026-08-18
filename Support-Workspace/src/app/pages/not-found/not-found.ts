import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private authService = inject(AuthService);

  get backRoute(): string {
    const role = this.authService.profile()?.role;

    if (role === 'agent') {
      return '/agent';
    }

    if (role === 'manager') {
      return '/manager';
    }

    return '/login';
  }

  get backLabel(): string {
    const role = this.authService.profile()?.role;

    if (role === 'agent') {
      return 'Back to Agent Dashboard';
    }

    if (role === 'manager') {
      return 'Back to Manager Dashboard';
    }

    return 'Back to Login';
  }
}
