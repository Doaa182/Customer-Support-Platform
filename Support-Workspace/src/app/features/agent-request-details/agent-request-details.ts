import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RequestService, SupportRequest } from '../../core/services/request.service';
import { supabase } from '../../core/supabase';

interface Message {
  id: string;
  request_id: string;
  author_id: string;
  content: string;
  type: 'customer' | 'internal';
  created_at: string;
}

@Component({
  selector: 'app-agent-request-details',
  imports: [],
  templateUrl: './agent-request-details.html',
  styleUrl: './agent-request-details.css',
})
export class AgentRequestDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private requestService = inject(RequestService);
  private cdr = inject(ChangeDetectorRef);

  request: SupportRequest | null = null;
  messages: Message[] = [];

  loading = true;
  error = '';

  async ngOnInit(): Promise<void> {
    const requestId = this.route.snapshot.paramMap.get('id');

    if (!requestId) {
      this.error = 'Request not found.';
      this.loading = false;
      return;
    }

    await this.loadRequest(requestId);
  }

  private async loadRequest(requestId: string): Promise<void> {
    console.log('Agent request ID:', requestId);

    this.loading = true;
    this.error = '';

    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', requestId)
      .single();

    console.log('Request result:', { data, error });

    if (error) {
      this.error = error.message;
      this.loading = false;
      return;
    }

    this.request = data;

    const messagesResult = await supabase
      .from('messages')
      .select('*')
      .eq('request_id', requestId)
      .eq('type', 'customer')
      .order('created_at', { ascending: true });

    console.log('Messages result:', messagesResult);

    if (messagesResult.error) {
      this.error = messagesResult.error.message;
      this.loading = false;
      return;
    }

    this.messages = messagesResult.data ?? [];
    this.loading = false;

    this.cdr.detectChanges();
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }

  goBack(): void {
    this.router.navigate(['/agent']);
  }
}
