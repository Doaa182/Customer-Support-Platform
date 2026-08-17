import { Injectable, signal } from '@angular/core';
import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  name: string;
  role: 'customer' | 'agent' | 'manager';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = signal<User | null>(null);
  profile = signal<Profile | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  async signIn(email: string, password: string): Promise<boolean> {
    this.loading.set(true);
    this.error.set(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      this.error.set(error.message);
      this.loading.set(false);
      return false;
    }

    this.user.set(data.user);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, role')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      this.error.set(profileError.message);
      this.loading.set(false);
      return false;
    }

    this.profile.set(profile);
    this.loading.set(false);

    return true;
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();

    this.user.set(null);
    this.profile.set(null);
  }
}
