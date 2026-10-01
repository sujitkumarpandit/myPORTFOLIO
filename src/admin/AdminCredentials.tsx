import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Credential } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImageUpload } from '../components/ImageUpload';

export function AdminCredentials() {
  const credentials = useStore(state => state.credentials);
  const refreshAll = useStore(state => state.refreshAll);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Credential>>({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.createNew) {
      handleNew();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleEdit = (credential: Credential) => {
    setEditingId(credential.id);
    setFormData(credential);
  };

  const handleNew = () => {
    const id = `c-${Date.now()}`;
    setEditingId(id);
    setFormData({
      id,
      title: '',
      issuer: '',
      date: new Date().getFullYear().toString(),
      credentialId: '',
      verified: true,
      type: 'CERTIFICATE'
    } as Partial<Credential>);
  };

  const handleSave = async () => {
    if (!formData.id || !formData.title?.trim()) {
      alert('Please enter credential title.');
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('credentials')
          .upsert({
            ...formData,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          console.error('Supabase credential save error:', error);
          alert(`Error saving credential: ${error.message}`);
        }
      }

      await refreshAll();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save credential');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this credential?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('credentials')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase credential delete error:', error);
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
              04 / CREDENTIALS CMS
            </span>
            <h2 className="text-xl font-bold uppercase tracking-widest">{formData.title ? 'Edit Credential' : 'New Credential'}</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-[var(--border)] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--surface)]">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90">Save</button>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Title (e.g. AWS Certified Developer)</label>
            <input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Issuer (e.g. Amazon Web Services)</label>
            <input value={formData.issuer || ''} onChange={e => setFormData({...formData, issuer: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Date / Year</label>
            <input value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Credential ID (Optional)</label>
            <input value={formData.credentialId || ''} onChange={e => setFormData({...formData, credentialId: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Type</label>
            <select value={formData.type || 'CERTIFICATE'} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none">
              <option value="CERTIFICATE">CERTIFICATE</option>
              <option value="DEGREE">DEGREE</option>
              <option value="AWARD">AWARD</option>
            </select>
          </div>
          <div>
            <ImageUpload 
              label="Certificate Image"
              value={formData.image}
              onChange={(val) => setFormData({...formData, image: val})}
              accept="image/*"
            />
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
            04 / CREDENTIALS CMS
          </span>
          <h2 className="text-xl font-bold uppercase tracking-widest">Credentials & Certifications</h2>
        </div>
        <button onClick={handleNew} className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90">
          + New Credential
        </button>
      </div>

      <div className="grid gap-4">
        {credentials.map(credential => (
          <div key={credential.id} className="bg-[var(--surface)] border border-[var(--border)] p-4 flex justify-between items-center rounded-sm hover:border-[var(--text-primary)] transition-colors">
            <div>
              <div className="flex gap-2 items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">[{credential.type}]</span>
                <span className="text-[10px] text-[var(--text-secondary)]">{credential.date}</span>
              </div>
              <h3 className="font-bold">{credential.title}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{credential.issuer}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(credential)} className="text-xs font-bold uppercase tracking-widest hover:text-[var(--accent)] px-3 py-1 border border-[var(--border)] rounded-sm">Edit</button>
              <button onClick={() => handleDelete(credential.id)} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 px-3 py-1 border border-red-500/20 rounded-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
