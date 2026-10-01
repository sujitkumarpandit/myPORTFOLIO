import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BrandEntity, BrandEntityCategory } from '../types';
import { TagInput } from '../components/TagInput';
import { defaultEntities } from '../lib/brandRegistry';

export function AdminEntities() {
  const entities = useStore(state => state.entities);
  const refreshAll = useStore(state => state.refreshAll);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BrandEntity>>({});
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const handleEdit = (entity: BrandEntity) => {
    setEditingId(entity.id);
    setFormData(entity);
  };

  const handleNew = () => {
    const id = `entity-${Date.now()}`;
    setEditingId(id);
    setFormData({
      id,
      name: '',
      aliases: [],
      category: 'technology',
      color: '#000000',
      darkColor: '#FFFFFF',
      enabled: true
    });
  };

  const handleSave = async () => {
    if (!formData.name?.trim()) {
      alert('Entity name is required');
      return;
    }

    try {
      const entityId = formData.id || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const payload: BrandEntity = {
        id: entityId,
        name: formData.name.trim(),
        aliases: formData.aliases || [],
        category: formData.category || 'technology',
        color: formData.color || '#000000',
        darkColor: formData.darkColor,
        textColor: formData.textColor,
        background: formData.background,
        border: formData.border,
        icon: formData.icon,
        officialUrl: formData.officialUrl,
        description: formData.description,
        enabled: formData.enabled !== false
      };

      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('entities')
          .upsert({
            ...payload,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          console.error('Supabase entity save error:', error);
          alert(`Error saving entity: ${error.message}`);
        }
      }

      await refreshAll();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save entity');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entity definition?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('entities')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase entity delete error:', error);
        }
      }
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm('Seed all default entities into Supabase?')) return;
    try {
      if (isSupabaseConfigured()) {
        const itemsToUpsert = defaultEntities.map(e => ({
          ...e,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
          .from('entities')
          .upsert(itemsToUpsert, { onConflict: 'id' });

        if (error) {
          console.error('Supabase seed error:', error);
          alert(`Error seeding entities: ${error.message}`);
          return;
        }
      }
      await refreshAll();
      alert('Default entities seeded to Supabase!');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEntities = entities.filter(e => {
    if (filterCategory === 'ALL') return true;
    return e.category === filterCategory;
  });

  if (editingId) {
    return (
      <div className="p-8 max-w-4xl font-mono">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border)]">
          <div>
            <span className="text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase block mb-1">
              06 / SEMANTIC HIGHLIGHTS CMS
            </span>
            <h2 className="text-xl font-bold uppercase tracking-widest">{formData.name ? `Edit: ${formData.name}` : 'New Brand Entity'}</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-[var(--border)] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--surface)]">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90">Save</button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Canonical Name</label>
              <input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" placeholder="e.g. React" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Category</label>
              <select value={formData.category || 'technology'} onChange={e => setFormData({...formData, category: e.target.value as BrandEntityCategory})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none">
                <option value="platform">Platform</option>
                <option value="technology">Technology</option>
                <option value="language">Language</option>
                <option value="framework">Framework</option>
                <option value="database">Database</option>
                <option value="cloud">Cloud</option>
                <option value="tool">Tool</option>
                <option value="company">Company</option>
                <option value="social">Social</option>
              </select>
            </div>
          </div>

          <div>
            <TagInput 
              label="Aliases (Keywords to highlight)"
              tags={formData.aliases || []}
              onChange={aliases => setFormData({...formData, aliases})}
              placeholder="e.g. reactjs, react.js, React.js"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Brand Color (Hex or CSS)</label>
              <input value={formData.color || ''} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" placeholder="#61DAFB" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Official URL (Optional)</label>
              <input value={formData.officialUrl || ''} onChange={e => setFormData({...formData, officialUrl: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" placeholder="https://react.dev" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Description / Tooltip (Optional)</label>
            <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" placeholder="A JavaScript library for building user interfaces" />
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
            06 / SEMANTIC HIGHLIGHTS CMS
          </span>
          <h2 className="text-xl font-bold uppercase tracking-widest">Brand Entities &amp; Highlight Registry</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSeedDefaults} className="px-3 py-2 border border-[var(--border)] text-xs font-bold uppercase tracking-wider rounded-sm hover:border-[var(--text-primary)]">
            Seed Defaults
          </button>
          <button onClick={handleNew} className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90">
            + New Entity
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'technology', 'framework', 'language', 'database', 'cloud', 'tool', 'platform'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border rounded-sm ${filterCategory === cat ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]' : 'border-[var(--border)] text-[var(--text-secondary)]'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredEntities.map(entity => (
          <div key={entity.id} className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-sm flex justify-between items-center hover:border-[var(--text-primary)] transition-colors">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: entity.color }} />
              <div>
                <span className="font-bold text-sm mr-2">{entity.name}</span>
                <span className="text-[10px] uppercase text-[var(--accent)] font-bold mr-2">[{entity.category}]</span>
                <span className="text-xs text-[var(--text-secondary)]">Aliases: {(entity.aliases || []).join(', ') || 'None'}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(entity)} className="text-xs font-bold uppercase tracking-widest hover:text-[var(--accent)] px-3 py-1 border border-[var(--border)] rounded-sm">Edit</button>
              <button onClick={() => handleDelete(entity.id)} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 px-3 py-1 border border-red-500/20 rounded-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
