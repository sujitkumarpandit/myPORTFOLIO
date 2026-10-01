import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BeyondCodeItem, BeyondCodeType, BookStatus } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImageUpload } from '../components/ImageUpload';
import { defaultBeyondCode } from '../data';
import { BookOpen, Compass, HelpCircle, Sparkles, Plus, Trash2, Edit3, Eye, EyeOff, RotateCcw } from 'lucide-react';

export function AdminBeyondCode() {
  const beyondCode = useStore(state => state.beyondCode);
  const projects = useStore(state => state.projects);
  const refreshAll = useStore(state => state.refreshAll);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BeyondCodeItem>>({});
  const [activeFilter, setActiveFilter] = useState<'ALL' | BeyondCodeType>('ALL');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.createNew) {
      handleNew('BOOK');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleEdit = (item: BeyondCodeItem) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleNew = (type: BeyondCodeType = 'BOOK') => {
    const id = `bc-${Date.now()}`;
    setEditingId(id);
    setFormData({
      id,
      type,
      title: '',
      subtitle: '',
      why: '',
      note: '',
      description: '',
      status: type === 'BOOK' ? 'READING' : 'EXPLORING',
      image: '',
      topic: '',
      relatedProjectId: '',
      externalUrl: '',
      sortOrder: (beyondCode?.length || 0) + 1,
      published: true
    });
  };

  const handleSave = async () => {
    if (!formData.id || !formData.title?.trim()) {
      alert('Please enter a valid title.');
      return;
    }
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('beyond_code')
          .upsert({
            ...formData,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          console.error('Supabase beyond_code save error:', error);
          alert(`Error saving item: ${error.message}`);
        }
      }

      await refreshAll();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save Beyond Code item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('beyond_code')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase beyond_code delete error:', error);
          alert(`Failed to delete item: ${error.message}`);
        }
      }
      await refreshAll();
    } catch (err) {
      console.error(err);
      alert('Failed to delete item');
    }
  };

  const handleTogglePublish = async (item: BeyondCodeItem) => {
    try {
      if (isSupabaseConfigured()) {
        await supabase
          .from('beyond_code')
          .upsert({
            id: item.id,
            published: !item.published,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
      }
      await refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeedDefaults = async () => {
    if (!confirm('Seed default Beyond Code items to Supabase? This will populate the collection with curated books, exploration topics, and interests.')) return;
    try {
      if (isSupabaseConfigured()) {
        const itemsToUpsert = defaultBeyondCode.map(item => ({
          ...item,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
          .from('beyond_code')
          .upsert(itemsToUpsert, { onConflict: 'id' });

        if (error) {
          console.error('Supabase seed error:', error);
          alert(`Error seeding to Supabase: ${error.message}`);
          return;
        }
      }
      await refreshAll();
      alert('Default Beyond Code items seeded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to seed defaults');
    }
  };

  const filteredItems = (beyondCode || []).filter(item => {
    if (activeFilter === 'ALL') return true;
    return item.type === activeFilter;
  });

  if (editingId) {
    return (
      <div className="p-8 max-w-4xl font-mono">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border)]">
          <div>
            <span className="text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase block mb-1">
              BEYOND CODE CMS
            </span>
            <h2 className="text-xl font-bold uppercase tracking-widest">
              {formData.title ? `Edit: ${formData.title}` : 'New Beyond Code Item'}
            </h2>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="px-4 py-2 border border-[var(--border)] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--surface)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90"
            >
              Save Item
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Type Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                Content Type *
              </label>
              <select
                value={formData.type || 'BOOK'}
                onChange={e => setFormData({ ...formData, type: e.target.value as BeyondCodeType })}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
              >
                <option value="BOOK">BOOK (Reading Now / Reading Archive)</option>
                <option value="EXPLORING">EXPLORING (Topic &amp; Paradigm)</option>
                <option value="CURIOUS_ABOUT">CURIOUS_ABOUT (Intellectual Thought)</option>
                <option value="INTEREST">INTEREST (Offline / Creative Pursuits)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                Publication State
              </label>
              <select
                value={formData.published !== false ? 'PUBLISHED' : 'DRAFT'}
                onChange={e => setFormData({ ...formData, published: e.target.value === 'PUBLISHED' })}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
              >
                <option value="PUBLISHED">PUBLISHED (Visible on /now)</option>
                <option value="DRAFT">DRAFT / HIDDEN (Admin only)</option>
              </select>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                {formData.type === 'BOOK' ? 'Book Title *' : formData.type === 'CURIOUS_ABOUT' ? 'Curiosity Statement *' : 'Title / Topic *'}
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder={formData.type === 'BOOK' ? 'e.g., Designing Data-Intensive Applications' : 'e.g., Direct Manipulation in Spatial UI'}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                {formData.type === 'BOOK' ? 'Author(s)' : formData.type === 'INTEREST' ? 'Category / Medium' : 'Subtitle / Focus'}
              </label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder={formData.type === 'BOOK' ? 'e.g., Martin Kleppmann' : 'e.g., Interaction Paradigms'}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
              />
            </div>
          </div>

          {/* Status & Topic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {formData.type === 'BOOK' ? (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                  Reading Status
                </label>
                <select
                  value={formData.status || 'READING'}
                  onChange={e => setFormData({ ...formData, status: e.target.value as BookStatus })}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
                >
                  <option value="READING">READING (Active)</option>
                  <option value="STARTING">STARTING</option>
                  <option value="PAUSED">PAUSED</option>
                  <option value="FINISHED">FINISHED (Archive)</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                  Status Tag
                </label>
                <input
                  type="text"
                  value={formData.status || ''}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  placeholder="e.g., EXPLORING, ACTIVE"
                  className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                Related Topic
              </label>
              <input
                type="text"
                value={formData.topic || ''}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., Distributed Systems, HCI"
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                Connect to Project (Optional)
              </label>
              <select
                value={formData.relatedProjectId || ''}
                onChange={e => setFormData({ ...formData, relatedProjectId: e.target.value })}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
              >
                <option value="">None (Standalone)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Why I'm reading / exploring this */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
              Why I'm Reading / Exploring This (1 concise sentence)
            </label>
            <input
              type="text"
              value={formData.why || ''}
              onChange={e => setFormData({ ...formData, why: e.target.value })}
              placeholder="e.g., Exploring distributed systems architecture and consistency models beyond framework abstractions."
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
            />
          </div>

          {/* Notes / Context */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
              Annotation / Notes (Semantic entity highlights active)
            </label>
            <textarea
              value={formData.note || ''}
              onChange={e => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              placeholder="e.g., Deep dive into consensus protocols (Raft, Paxos), LSM trees, and partition tolerance."
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
            />
          </div>

          {/* Cover / Image Upload */}
          {(formData.type === 'BOOK' || formData.type === 'INTEREST') && (
            <ImageUpload
              label={formData.type === 'BOOK' ? 'Book Cover Image (Small Aspect Ratio)' : 'Interest Image (Optional)'}
              value={formData.image}
              onChange={val => setFormData({ ...formData, image: val })}
            />
          )}

          {/* External URL & Sort Order */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                External Link (Goodreads, Publisher, Article)
              </label>
              <input
                type="url"
                value={formData.externalUrl || ''}
                onChange={e => setFormData({ ...formData, externalUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
                Display Sort Order
              </label>
              <input
                type="number"
                value={formData.sortOrder ?? 1}
                onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 1 })}
                className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 font-mono max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--border)]">
        <div>
          <span className="text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase block mb-1">
            07 / NOW CMS
          </span>
          <h2 className="text-xl font-bold uppercase tracking-widest">
            Beyond Code Manager
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Curate active reading, intellectual exploration, and non-distracting personal curiosity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSeedDefaults}
            className="px-3 py-2 border border-[var(--border)] hover:border-[var(--text-primary)] text-xs font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>Seed Presets</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleNew('BOOK')}
            className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Item</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['ALL', 'BOOK', 'EXPLORING', 'CURIOUS_ABOUT', 'INTEREST'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm border transition-colors ${
              activeFilter === tab
                ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]'
                : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)]/40'
            }`}
          >
            {tab === 'ALL' ? 'ALL ITEMS' : tab.replace('_', ' ')}
            <span className="ml-1.5 opacity-60">
              ({(beyondCode || []).filter(i => tab === 'ALL' || i.type === tab).length})
            </span>
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 border border-dashed border-[var(--border)] rounded-sm text-center text-[var(--text-secondary)]">
            <p className="text-sm uppercase tracking-widest mb-2">No Beyond Code items found.</p>
            <button
              type="button"
              onClick={handleSeedDefaults}
              className="text-xs text-[var(--accent)] hover:underline uppercase font-bold"
            >
              Seed default curated books and exploration items →
            </button>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className={`p-4 bg-[var(--surface)] border rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                item.published === false ? 'border-dashed border-[var(--border)] opacity-60' : 'border-[var(--border)]'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Type Icon */}
                <div className="w-10 h-10 shrink-0 bg-[var(--bg)] border border-[var(--border)] rounded-xs flex items-center justify-center">
                  {item.type === 'BOOK' && <BookOpen className="w-4 h-4 text-[var(--accent)]" />}
                  {item.type === 'EXPLORING' && <Compass className="w-4 h-4 text-[var(--accent)]" />}
                  {item.type === 'CURIOUS_ABOUT' && <HelpCircle className="w-4 h-4 text-[var(--accent)]" />}
                  {item.type === 'INTEREST' && <Sparkles className="w-4 h-4 text-[var(--accent)]" />}
                </div>

                {/* Content Details */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1 text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">
                    <span className="font-bold text-[var(--accent)]">{item.type}</span>
                    <span>·</span>
                    <span>{item.status || 'ACTIVE'}</span>
                    {item.topic && (
                      <>
                        <span>·</span>
                        <span className="text-[var(--text-primary)]">{item.topic}</span>
                      </>
                    )}
                    <span>·</span>
                    <span className={item.published !== false ? 'text-green-500 font-bold' : 'text-amber-500 font-bold'}>
                      {item.published !== false ? 'PUBLISHED' : 'DRAFT'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {item.subtitle}
                    </p>
                  )}

                  {item.why && (
                    <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1 italic">
                      Why: {item.why}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(item)}
                  title={item.published !== false ? 'Hide from public' : 'Publish to /now'}
                  className="p-2 border border-[var(--border)] hover:border-[var(--text-primary)] rounded-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {item.published !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-amber-500" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="px-3 py-1.5 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-xs hover:opacity-90 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-xs transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
