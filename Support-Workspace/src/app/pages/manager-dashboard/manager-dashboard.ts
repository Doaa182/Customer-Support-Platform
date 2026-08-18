import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RequestService, SupportRequest } from '../../core/services/request.service';
import { supabase } from '../../core/supabase';
import { AppHeader } from '../../components/app-header/app-header';

interface Agent {
  id: string;
  name: string;
  role: 'agent';
}

@Component({
  selector: 'app-manager-dashboard',
  imports: [FormsModule, AppHeader],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css',
})
export class ManagerDashboard implements OnInit {
  private requestService = inject(RequestService);
  private cdr = inject(ChangeDetectorRef);

  requests: SupportRequest[] = [];
  agents: Agent[] = [];

  selectedAgentId: Record<string, string> = {};
  reassigningRequestId: string | null = null;

  loading = true;
  error = '';

  async ngOnInit(): Promise<void> {
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

  async reassignRequest(requestId: string): Promise<void> {
    const agentId = this.selectedAgentId[requestId];

    if (!agentId) {
      return;
    }

    this.reassigningRequestId = requestId;
    this.error = '';

    const { error } = await supabase
      .from('requests')
      .update({
        assigned_agent_id: agentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) {
      this.error = error.message;
      this.reassigningRequestId = null;
      return;
    }

    await this.loadRequests();

    this.selectedAgentId[requestId] = '';
    this.reassigningRequestId = null;

    this.cdr.detectChanges();
  }

  getAssignedAgentName(agentId: string | null): string {
    if (!agentId) {
      return 'Unassigned';
    }

    const agent = this.agents.find((agent) => agent.id === agentId);

    return agent?.name ?? 'Unknown agent';
  }
}
