import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SupportRequest } from '../../core/services/request.service';
import { supabase } from '../../core/supabase';
import { FormsModule } from '@angular/forms';
import { AppHeader } from '../../components/app-header/app-header';

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
  imports: [FormsModule, AppHeader],
  templateUrl: './agent-request-details.html',
  styleUrl: './agent-request-details.css',
})
export class AgentRequestDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  request: SupportRequest | null = null;
  messages: Message[] = [];

  internalNote = '';

  loading = true;
  savingNote = false;
  error = '';

  agentMessage = '';
  sendingMessage = false;

  resolving = false;

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
    this.loading = false;

    this.cdr.detectChanges();
  }

  async addInternalNote(): Promise<void> {
    const content = this.internalNote.trim();

    if (!content || !this.request || this.savingNote) {
      return;
    }

    this.savingNote = true;
    this.error = '';

    try {
      const user = this.authService.user();

      if (!user) {
        this.error = 'You must be signed in.';
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
        return;
      }

      this.internalNote = '';

      await this.loadRequest(this.request.id);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to add internal note.';
    } finally {
      this.savingNote = false;
      this.cdr.detectChanges();
    }
  }

  async sendCustomerMessage(): Promise<void> {
    const content = this.agentMessage.trim();

    if (!content || !this.request || this.sendingMessage) {
      return;
    }

    this.sendingMessage = true;
    this.error = '';

    try {
      const user = this.authService.user();

      if (!user) {
        this.error = 'You must be signed in.';
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
        return;
      }

      this.agentMessage = '';

      await this.loadRequest(this.request.id);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to send message.';
    } finally {
      this.sendingMessage = false;
      this.cdr.detectChanges();
    }
  }

  async resolveRequest(): Promise<void> {
    if (!this.request || this.resolving) {
      return;
    }

    this.resolving = true;
    this.error = '';

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('requests')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', this.request.id)
        .select()
        .maybeSingle();

      if (error) {
        this.error = error.message;
        return;
      }

      if (!data) {
        this.error = 'You are not allowed to resolve this request.';
        return;
      }

      this.request = data;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to resolve request.';
    } finally {
      this.resolving = false;
      this.cdr.detectChanges();
    }
  }

  goBack(): void {
    this.router.navigate(['/agent']);
  }
}
