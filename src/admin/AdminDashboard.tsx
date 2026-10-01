import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const profile = useStore(state => state.profile);
  const projects = useStore(state => state.projects);
  const posts = useStore(state => state.posts);
  const credentials = useStore(state => state.credentials);
  const beyondCode = useStore(state => state.beyondCode);
  const navigate = useNavigate();

  return (
    <div className="p-8 font-mono">
      <h2 className="text-xl font-bold uppercase tracking-widest mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-sm">
          <div className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-2">Projects</div>
          <div className="text-3xl font-bold">{projects.length}</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-sm">
          <div className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-2">Posts</div>
          <div className="text-3xl font-bold">{posts.length}</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-sm">
          <div className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-2">Credentials</div>
          <div className="text-3xl font-bold">{credentials.length}</div>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-sm">
          <div className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-2">Beyond Code</div>
          <div className="text-3xl font-bold">{beyondCode?.length || 0}</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => navigate('/admin/projects', { state: { createNew: true } })}
            className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90"
          >
            + New Project
          </button>
          <button 
            onClick={() => navigate('/admin/posts', { state: { createNew: true } })}
            className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90"
          >
            + New Post
          </button>
          <button 
            onClick={() => navigate('/admin/beyond-code', { state: { createNew: true } })}
            className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-xs font-bold uppercase tracking-wider rounded-sm"
          >
            + New Book / Beyond Code
          </button>
        </div>
      </div>
    </div>
  );
}
