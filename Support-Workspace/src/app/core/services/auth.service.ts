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
  initialized = signal(false);

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    this.loading.set(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      this.error.set(error.message);
      this.loading.set(false);
      this.initialized.set(true);
      return;
    }

    if (session?.user) {
      await this.loadUserProfile(session.user);
    }

    this.loading.set(false);
    this.initialized.set(true);
  }

  private async loadUserProfile(user: User): Promise<boolean> {
    this.user.set(user);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      this.error.set(profileError.message);
      this.profile.set(null);
      return false;
    }

    this.profile.set(profile);
    return true;
  }

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

    const profileLoaded = await this.loadUserProfile(data.user);

    this.loading.set(false);

    return profileLoaded;
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();

    this.user.set(null);
    this.profile.set(null);
  }
}
