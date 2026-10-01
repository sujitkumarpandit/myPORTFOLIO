import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ActivityPost } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImageUpload } from '../components/ImageUpload';
import { TagInput } from '../components/TagInput';

export function AdminPosts() {
  const posts = useStore(state => state.posts);
  const refreshAll = useStore(state => state.refreshAll);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ActivityPost>>({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.createNew) {
      handleNew();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleEdit = (post: ActivityPost) => {
    setEditingId(post.id);
    setFormData(post);
  };

  const handleNew = () => {
    const id = `a-${Date.now()}`;
    setEditingId(id);
    setFormData({
      id,
      type: 'TEXT',
      date: new Date().toISOString(),
      content: '',
      tags: [],
      likeCount: 0
    } as Partial<ActivityPost>);
  };

  const handleSave = async () => {
    if (!formData.id || !formData.content?.trim()) {
      alert('Please enter post content.');
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('posts')
          .upsert({
            ...formData,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          console.error('Supabase post save error:', error);
          alert(`Error saving post: ${error.message}`);
        }
      }

      await refreshAll();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase post delete error:', error);
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
              03 / ACTIVITY FEED CMS
            </span>
            <h2 className="text-xl font-bold uppercase tracking-widest">{formData.content ? 'Edit Post' : 'New Post'}</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-[var(--border)] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--surface)]">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90">Save</button>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Type</label>
            <select value={formData.type || 'TEXT'} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none">
              <option value="TEXT">TEXT</option>
              <option value="BUILD_UPDATE">BUILD_UPDATE</option>
              <option value="MILESTONE">MILESTONE</option>
              <option value="LEARNING">LEARNING</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Content</label>
            <textarea value={formData.content || ''} onChange={e => setFormData({...formData, content: e.target.value})} rows={6} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <ImageUpload 
            label="Media (Image or Video)"
            value={formData.mediaUrl}
            onChange={(val) => setFormData({...formData, mediaUrl: val})}
          />
          <TagInput 
            label="Tags"
            tags={formData.tags || []}
            onChange={(tags) => setFormData({...formData, tags})}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 font-mono max-w-5xl">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border)]">
        <div>
          <span className="text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase block mb-1">
            03 / ACTIVITY FEED CMS
          </span>
          <h2 className="text-xl font-bold uppercase tracking-widest">Posts & Activity</h2>
        </div>
        <button onClick={handleNew} className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90">
          + New Post
        </button>
      </div>

      <div className="grid gap-4">
        {posts.map(post => (
          <div key={post.id} className="bg-[var(--surface)] border border-[var(--border)] p-4 flex justify-between items-center rounded-sm hover:border-[var(--text-primary)] transition-colors">
            <div>
              <div className="flex gap-2 items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">[{post.type}]</span>
                <span className="text-[10px] text-[var(--text-secondary)]">{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm truncate max-w-xl">{post.content}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(post)} className="text-xs font-bold uppercase tracking-widest hover:text-[var(--accent)] px-3 py-1 border border-[var(--border)] rounded-sm">Edit</button>
              <button onClick={() => handleDelete(post.id)} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 px-3 py-1 border border-red-500/20 rounded-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
