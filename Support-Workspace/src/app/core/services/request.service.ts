import { Injectable } from '@angular/core';
import { supabase } from '../supabase';

export interface SupportRequest {
  id: string;
  reference: string;
  customer_id: string;
  assigned_agent_id: string | null;
  description: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  async getRequests(): Promise<{
    data: SupportRequest[] | null;
    error: string | null;
  }> {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      return {
        data: null,
        error: error.message,
      };
    }

    return {
      data,
      error: null,
    };
  }

  async assignToCurrentAgent(requestId: string): Promise<{ error: string | null }> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'You must be signed in.' };
    }

    const { error } = await supabase
      .from('requests')
      .update({
        assigned_agent_id: user.id,
        status: 'in_progress',
      })
      .eq('id', requestId)
      .is('assigned_agent_id', null);

    return {
      error: error ? error.message : null,
    };
  }
}
