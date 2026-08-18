import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  get loading() {
    return this.authService.loading();
  }

  get error() {
    return this.authService.error();
  }

  async login(): Promise<void> {
    const success = await this.authService.signIn(this.email, this.password);

    if (!success) {
      return;
    }

    const role = this.authService.profile()?.role;

    if (role === 'agent') {
      await this.router.navigate(['/agent']);
    } else if (role === 'manager') {
      await this.router.navigate(['/manager']);
    } else {
      this.authService.setError(
        'Access denied. This workspace is only available to agents and managers.',
      );

      await this.authService.signOut();
    }
  }
}
