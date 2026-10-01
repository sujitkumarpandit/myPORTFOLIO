import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ImageUpload } from '../components/ImageUpload';
import { TagInput } from '../components/TagInput';
import { AdminArrayEditor } from './AdminArrayEditor';

export function AdminProfile() {
  const profile = useStore(state => state.profile);
  const refreshAll = useStore(state => state.refreshAll);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const field = name.split('.')[1];
      setFormData((prev: any) => ({
        ...prev,
        social: { ...prev.social, [field]: value }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { id, ...dataToSave } = formData;
      const payload = {
        id: id || 'default',
        ...dataToSave,
        updated_at: new Date().toISOString()
      };

      if (isSupabaseConfigured()) {
        const { error } = await supabase
          .from('profiles')
          .upsert(payload, { onConflict: 'id' });

        if (error) {
          console.error('Supabase profile save error:', error);
          alert(`Error saving profile to Supabase: ${error.message}`);
        } else {
          alert('Profile saved to Supabase successfully!');
        }
      } else {
        alert('Profile saved locally (Demo mode)!');
      }

      await refreshAll();
    } catch (err: any) {
      console.error(err);
      alert('Failed to save profile');
    }
    setSaving(false);
  };

  if (!profile) return <div className="p-8 font-mono">Loading profile...</div>;

  return (
    <div className="p-8 max-w-4xl font-mono">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-[var(--border)]">
        <div>
          <span className="text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase block mb-1">
            01 / CMS
          </span>
          <h2 className="text-xl font-bold uppercase tracking-widest">Edit Profile</h2>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {saving ? 'Saving...' : '[ SAVE PROFILE ]'}
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Name</label>
            <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Headline</label>
            <input name="headline" value={formData.headline || ''} onChange={handleChange} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div className="md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Summary</label>
            <textarea name="summary" value={formData.summary || ''} onChange={handleChange} rows={4} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Location</label>
            <input name="location" value={formData.location || ''} onChange={handleChange} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Role</label>
            <input name="role" value={formData.role || ''} onChange={handleChange} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Status</label>
            <select name="status" value={formData.status || ''} onChange={handleChange} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]">
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OPEN TO OPPORTUNITIES">OPEN TO OPPORTUNITIES</option>
              <option value="BUILDING">BUILDING</option>
              <option value="NOT LOOKING">NOT LOOKING</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <ImageUpload 
              label="Profile Photo"
              value={formData.profileImage}
              onChange={(val) => setFormData((prev: any) => ({...prev, profileImage: val}))}
              accept="image/*"
            />
          </div>
          <div className="md:col-span-2">
            <ImageUpload 
              label="Profile Banner"
              value={formData.bannerImage}
              onChange={(val) => setFormData((prev: any) => ({...prev, bannerImage: val}))}
              accept="image/*"
            />
          </div>
          <div className="md:col-span-2">
            <TagInput 
              label="Skills"
              tags={formData.skills || []}
              onChange={(tags) => setFormData((prev: any) => ({...prev, skills: tags}))}
              placeholder="Add a skill and press Enter..."
            />
          </div>

          <div className="md:col-span-2">
            <AdminArrayEditor
              label="Experience"
              items={formData.experience || []}
              onChange={(items) => setFormData((prev: any) => ({ ...prev, experience: items }))}
              defaultNewItem={{ role: '', company: '', period: '', description: '', logo: '' }}
              renderItem={(item: any, index: number, updateItem: any) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Role</label>
                    <input value={item.role} onChange={e => updateItem(index, 'role', e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Company</label>
                    <input value={item.company} onChange={e => updateItem(index, 'company', e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Period</label>
                    <input value={item.period} onChange={e => updateItem(index, 'period', e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Description</label>
                    <textarea value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} rows={3} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <ImageUpload 
                      label="Company Logo"
                      value={item.logo}
                      onChange={(val) => updateItem(index, 'logo', val)}
                      accept="image/*"
                    />
                  </div>
                </div>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <AdminArrayEditor
              label="Qualifications"
              items={formData.qualifications || []}
              onChange={(items) => setFormData((prev: any) => ({ ...prev, qualifications: items }))}
              defaultNewItem={{ degree: '', institution: '', year: '', logo: '' }}
              renderItem={(item: any, index: number, updateItem: any) => (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Degree / Cert</label>
                    <input value={item.degree} onChange={e => updateItem(index, 'degree', e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Institution</label>
                    <input value={item.institution} onChange={e => updateItem(index, 'institution', e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Year</label>
                    <input value={item.year} onChange={e => updateItem(index, 'year', e.target.value)} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none" />
                  </div>
                  <div className="md:col-span-3">
                    <ImageUpload 
                      label="Institution Logo"
                      value={item.logo}
                      onChange={(val) => updateItem(index, 'logo', val)}
                      accept="image/*"
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-widest mt-8 mb-4 border-b border-[var(--border)] pb-2">Contact & Social</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Email</label>
            <input name="email" value={formData.email || ''} onChange={handleChange} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">Phone</label>
            <input name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">GitHub</label>
            <input name="social.github" value={formData.social?.github || ''} onChange={handleChange} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">LinkedIn</label>
            <input name="social.linkedin" value={formData.social?.linkedin || ''} onChange={handleChange} className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" />
          </div>
        </div>
      </form>
    </div>
  );
}
