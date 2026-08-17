import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { supabase } from '../../core/supabase';

@Component({
  selector: 'app-agent-dashboard',
  imports: [],
  templateUrl: './agent-dashboard.html',
  styleUrl: './agent-dashboard.css',
})
export class AgentDashboard {
  private authService = inject(AuthService);
  private router = inject(Router);

  async signOut(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }

  async testAgentRequestsAccess(): Promise<void> {
    const { data, error } = await supabase.from('requests').select('*');

    console.log('Agent requests:', data);
    console.log('Agent requests error:', error);
  }

  async testAgentMessagesAccess(): Promise<void> {
    const { data, error } = await supabase.from('messages').select('*');

    console.log('Agent messages:', data);
    console.log('Agent messages error:', error);
  }
}
