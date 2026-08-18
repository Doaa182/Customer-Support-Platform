import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RequestService, SupportRequest } from '../../core/services/request.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agent-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './agent-dashboard.html',
  styleUrl: './agent-dashboard.css',
})
export class AgentDashboard implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private requestService = inject(RequestService);
  private cdr = inject(ChangeDetectorRef);

  requests: SupportRequest[] = [];
  searchTerm = '';

  statusFilter = '';
  urgencyFilter = '';
  categoryFilter = '';
  assignmentFilter = '';

  loading = true;
  error = '';

  async ngOnInit(): Promise<void> {
    await this.loadRequests();
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

  async takeRequest(requestId: string): Promise<void> {
    const result = await this.requestService.assignToCurrentAgent(requestId);

    if (result.error) {
      this.error = result.error;
      return;
    }

    await this.loadRequests();
  }

  get filteredRequests(): SupportRequest[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.requests.filter((request) => {
      const matchesSearch =
        !term ||
        request.reference.toLowerCase().includes(term) ||
        request.description.toLowerCase().includes(term) ||
        request.category.toLowerCase().includes(term) ||
        request.urgency.toLowerCase().includes(term) ||
        request.status.toLowerCase().includes(term);

      const matchesStatus = !this.statusFilter || request.status === this.statusFilter;

      const matchesUrgency = !this.urgencyFilter || request.urgency === this.urgencyFilter;

      const matchesCategory = !this.categoryFilter || request.category === this.categoryFilter;

      const matchesAssignment =
        !this.assignmentFilter ||
        (this.assignmentFilter === 'assigned' && !!request.assigned_agent_id) ||
        (this.assignmentFilter === 'unassigned' && !request.assigned_agent_id);

      return (
        matchesSearch && matchesStatus && matchesUrgency && matchesCategory && matchesAssignment
      );
    });
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}
