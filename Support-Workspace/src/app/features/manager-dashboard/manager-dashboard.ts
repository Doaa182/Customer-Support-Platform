import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RequestService, SupportRequest } from '../../core/services/request.service';
import { supabase } from '../../core/supabase';

interface Agent {
  id: string;
  name: string;
  role: 'agent';
}

@Component({
  selector: 'app-manager-dashboard',
  imports: [],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css',
})
export class ManagerDashboard implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private requestService = inject(RequestService);
  private cdr = inject(ChangeDetectorRef);

  requests: SupportRequest[] = [];
  agents: Agent[] = [];

  loading = true;
  error = '';

  async ngOnInit(): Promise<void> {
    const user = this.authService.user();

    console.log('Logged-in user:', user);
    console.log('Logged-in user ID:', user?.id);

    await this.loadRequests();
    await this.loadAgents();
  }

  async loadRequests(): Promise<void> {
    this.loading = true;
    this.error = '';

    const result = await this.requestService.getRequests();

    if (result.error) {
      this.error = result.error;
      this.loading = false;
      return;
    }

    this.requests = result.data ?? [];
    this.loading = false;

    this.cdr.detectChanges();
  }

  async loadAgents(): Promise<void> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, role')
      .eq('role', 'agent');

    if (error) {
      this.error = error.message;
      return;
    }

    this.agents = data ?? [];

    this.cdr.detectChanges();
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}
