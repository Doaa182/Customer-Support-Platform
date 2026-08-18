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
  sortBy = 'newest';

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

    const filtered = this.requests.filter((request) => {
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

    return [...filtered].sort((a, b) => {
      switch (this.sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

        case 'recently_updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();

        case 'urgency_high':
          return this.getUrgencyPriority(b.urgency) - this.getUrgencyPriority(a.urgency);

        case 'urgency_low':
          return this.getUrgencyPriority(a.urgency) - this.getUrgencyPriority(b.urgency);

        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }

  private getUrgencyPriority(urgency: string): number {
    switch (urgency) {
      case 'high':
        return 3;
      case 'medium':
        return 2;
      case 'low':
        return 1;
      default:
        return 0;
    }
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}
