import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { isSupabaseConfigured } from '../lib/supabase';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] p-4 font-mono">
      <div className="w-full max-w-md bg-[var(--surface)] border border-[var(--border)] p-8 rounded-sm shadow-xs">
        <div className="text-center mb-6">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[var(--accent)] mb-1">
            SUPABASE AUTHENTICATION
          </div>
          <h1 className="text-base font-bold tracking-widest uppercase text-[var(--text-primary)]">
            Admin Console Login
          </h1>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-500 text-xs mb-4 rounded-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
              Email / Username
            </label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-4 py-2.5 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Authenticating...' : '[ LOG IN TO CONSOLE ]'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[var(--border)] text-[10px] text-[var(--text-secondary)] text-center space-y-1">
          <p className="uppercase tracking-widest">
            {isSupabaseConfigured() ? '✓ Connected to Supabase' : '• Offline / Demo Mode Active'}
          </p>
        </div>
      </div>
    </div>
  );
}
