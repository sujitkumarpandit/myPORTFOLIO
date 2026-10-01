import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project } from '../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImageUpload } from '../components/ImageUpload';
import { TagInput } from '../components/TagInput';

export function AdminProjects() {
  const projects = useStore(state => state.projects);
  const refreshAll = useStore(state => state.refreshAll);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({});
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.createNew) {
      handleNew();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
  };

  const handleNew = () => {
    const id = `p-${Date.now()}`;
    setEditingId(id);
    setFormData({
      id,
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      year: new Date().getFullYear().toString(),
      role: '',
      category: '',
      technologies: [],
      heroImage: '',
      problem: '',
      goal: '',
      architecture: '',
      results: ''
    });
  };

  const handleSave = async () => {
    if (!formData.id || !formData.title?.trim()) {
      alert('Please enter a project title.');
      return;
    }

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('projects')
          .upsert({
            ...formData,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (error) {
          console.error('Supabase save error:', error);
          alert(`Error saving project: ${error.message}`);
        }
      }

      await refreshAll();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Supabase delete error:', error);
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
              02 / PROJECTS CMS
            </span>
            <h2 className="text-xl font-bold uppercase tracking-widest">{formData.title ? 'Edit Project' : 'New Project'}</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-[var(--border)] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--surface)]">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90">Save</button>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Title</label>
            <input value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Slug</label>
            <input value={formData.slug || ''} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Short Description</label>
            <textarea value={formData.shortDescription || ''} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Full Description</label>
            <textarea value={formData.fullDescription || ''} onChange={e => setFormData({...formData, fullDescription: e.target.value})} rows={4} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Role</label>
              <input value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Category</label>
              <input value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
            </div>
          </div>
          <ImageUpload 
            label="Hero Image"
            value={formData.heroImage}
            onChange={(val) => setFormData({...formData, heroImage: val})}
            accept="image/*"
          />
          <TagInput 
            label="Technologies"
            tags={formData.technologies || []}
            onChange={(tags) => setFormData({...formData, technologies: tags})}
            placeholder="Type technology and press Enter..."
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
            02 / PROJECTS CMS
          </span>
          <h2 className="text-xl font-bold uppercase tracking-widest">Projects</h2>
        </div>
        <button onClick={handleNew} className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90">
          + New Project
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map(project => (
          <div key={project.id} className="bg-[var(--surface)] border border-[var(--border)] p-4 flex justify-between items-center rounded-sm hover:border-[var(--text-primary)] transition-colors">
            <div>
              <h3 className="font-bold">{project.title}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{project.shortDescription}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(project)} className="text-xs font-bold uppercase tracking-widest hover:text-[var(--accent)] px-3 py-1 border border-[var(--border)] rounded-sm">Edit</button>
              <button onClick={() => handleDelete(project.id)} className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 px-3 py-1 border border-red-500/20 rounded-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
