import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RequestService, SupportRequest } from '../../core/services/request.service';
import { supabase } from '../../core/supabase';
import { FormsModule } from '@angular/forms';

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
  imports: [FormsModule],
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

  internalNote = '';

  loading = true;
  savingNote = false;
  error = '';

  agentMessage = '';
  sendingMessage = false;

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
    this.loading = true;
    this.error = '';

    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', requestId)
      .single();

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
      .order('created_at', { ascending: true });

    if (messagesResult.error) {
      this.error = messagesResult.error.message;
      this.loading = false;
      return;
    }

    this.messages = messagesResult.data ?? [];
    console.log('All messages for this request:', this.messages);
    this.loading = false;

    this.cdr.detectChanges();
  }

  async addInternalNote(): Promise<void> {
    const content = this.internalNote.trim();

    if (!content || !this.request) {
      return;
    }

    this.savingNote = true;
    this.error = '';

    const user = this.authService.user();

    if (!user) {
      this.error = 'You must be signed in.';
      this.savingNote = false;
      return;
    }

    const { error } = await supabase.from('messages').insert({
      request_id: this.request.id,
      author_id: user.id,
      content,
      type: 'internal',
    });

    if (error) {
      this.error = error.message;
      this.savingNote = false;
      return;
    }

    this.internalNote = '';
    await this.loadRequest(this.request.id);
    this.savingNote = false;

    this.cdr.detectChanges();
  }

  async sendCustomerMessage(): Promise<void> {
    const content = this.agentMessage.trim();

    if (!content || !this.request) {
      return;
    }

    this.sendingMessage = true;
    this.error = '';

    const user = this.authService.user();

    if (!user) {
      this.error = 'You must be signed in.';
      this.sendingMessage = false;
      return;
    }

    const { error } = await supabase.from('messages').insert({
      request_id: this.request.id,
      author_id: user.id,
      content,
      type: 'customer',
    });

    if (error) {
      this.error = error.message;
      this.sendingMessage = false;
      return;
    }

    this.agentMessage = '';

    await this.loadRequest(this.request.id);

    this.sendingMessage = false;
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }

  goBack(): void {
    this.router.navigate(['/agent']);
  }
}
