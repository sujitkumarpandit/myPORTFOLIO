import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TimelineEvent } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';

export function AdminJourney() {
  const timeline = useStore(state => state.timeline);
  const refreshAll = useStore(state => state.refreshAll);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TimelineEvent>>({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.createNew) {
      handleNew();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleEdit = (event: TimelineEvent) => {
    setEditingId(event.id);
    setFormData(event);
  };

  const handleNew = () => {
    const id = `t-${Date.now()}`;
    setEditingId(id);
    setFormData({
      id,
      year: new Date().getFullYear().toString(),
      title: '',
      description: '',
      category: 'FOUNDATIONS'
    } as Partial<TimelineEvent>);
  };

  const handleSave = async () => {
    if (!formData.id || !formData.title?.trim()) {
      alert('Please enter a title for the journey event.');
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('timeline')
          .upsert({
            ...formData,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          console.error('Supabase timeline save error:', error);
          alert(`Error saving timeline event: ${error.message}`);
        }
      }

      await refreshAll();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save timeline event');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('timeline')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase timeline delete error:', error);
        }
      }
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  if (editingId) {
    return (
      <div className="p-8 max-w-4xl font-mono">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border)]">
          <div>
            <span className="text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase block mb-1">
              05 / JOURNEY CMS
            </span>
            <h2 className="text-xl font-bold uppercase tracking-widest">{formData.title ? 'Edit Event' : 'New Event'}</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-[var(--border)] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--surface)]">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90">Save</button>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Title / Role (e.g. Senior Frontend Developer)</label>
            <input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Year</label>
            <input value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Description</label>
            <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={6} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Category</label>
            <select value={formData.category || 'FOUNDATIONS'} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none">
              <option value="FOUNDATIONS">FOUNDATIONS</option>
              <option value="FIRST PRODUCTS">FIRST PRODUCTS</option>
              <option value="PRODUCTION SYSTEMS">PRODUCTION SYSTEMS</option>
              <option value="NEXT">NEXT</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 font-mono max-w-5xl">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border)]">
        <div>
          <span className="text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase block mb-1">
            05 / JOURNEY CMS
          </span>
          <h2 className="text-xl font-bold uppercase tracking-widest">Journey & Work History</h2>
        </div>
        <button onClick={handleNew} className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90">
          + New Event
        </button>
      </div>

      <div className="grid gap-4">
        {timeline.map(event => (
          <div key={event.id} className="bg-[var(--surface)] border border-[var(--border)] p-4 flex justify-between items-center rounded-sm hover:border-[var(--text-primary)] transition-colors">
            <div>
              <div className="flex gap-2 items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">[{event.category}]</span>
                <span className="text-[10px] text-[var(--text-secondary)]">{event.year}</span>
              </div>
              <h3 className="font-bold">{event.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] truncate max-w-xl">{event.description}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(event)} className="text-xs font-bold uppercase tracking-widest hover:text-[var(--accent)] px-3 py-1 border border-[var(--border)] rounded-sm">Edit</button>
              <button onClick={() => handleDelete(event.id)} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 px-3 py-1 border border-red-500/20 rounded-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
