import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthState {
  isAdmin: boolean;
  loading: boolean;
  user: any | null;
  init: () => void;
  setAdminStatus: (status: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAdmin: false,
  loading: true,
  user: null,

  init: async () => {
    if (isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          set({
            isAdmin: true,
            user: session.user,
            loading: false,
          });
        } else {
          const isMockAdmin = localStorage.getItem('supabase_admin') === 'true';
          set({
            isAdmin: isMockAdmin,
            user: null,
            loading: false,
          });
        }

        // Listen to auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            set({ isAdmin: true, user: session.user, loading: false });
            localStorage.setItem('supabase_admin', 'true');
          } else {
            const isMockAdmin = localStorage.getItem('supabase_admin') === 'true';
            set({ isAdmin: isMockAdmin, user: null, loading: false });
          }
        });
        return;
      } catch (err) {
        console.warn('Supabase auth session error:', err);
      }
    }

    // Offline / Demo fallback
    const isMockAdmin = localStorage.getItem('supabase_admin') === 'true';
    set({
      isAdmin: isMockAdmin,
      user: null,
      loading: false,
    });
  },

  setAdminStatus: (status: boolean) => {
    if (status) {
      localStorage.setItem('supabase_admin', 'true');
    } else {
      localStorage.removeItem('supabase_admin');
    }
    set({ isAdmin: status });
  },

  login: async (email: string, password: string) => {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // If Supabase auth failed, check if default credentials match for developer convenience
          if ((email === 'admin@example.com' || email === 'Admin') && password === 'skp12345') {
            localStorage.setItem('supabase_admin', 'true');
            set({ isAdmin: true });
            return { success: true };
          }
          return { success: false, error: error.message };
        }

        if (data?.user) {
          localStorage.setItem('supabase_admin', 'true');
          set({ isAdmin: true, user: data.user });
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Supabase login failed' };
      }
    }

    // Offline / development fallback mode
    if ((email === 'admin@example.com' || email === 'Admin') && password === 'skp12345') {
      localStorage.setItem('supabase_admin', 'true');
      set({ isAdmin: true });
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  },

  logout: async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase logout error:', err);
      }
    }
    localStorage.removeItem('supabase_admin');
    set({ isAdmin: false, user: null });
  },
}));
