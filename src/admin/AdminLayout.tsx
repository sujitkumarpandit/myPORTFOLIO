import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function AdminLayout() {
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-[var(--border)] p-5 flex flex-col h-screen sticky top-0">
        <h1 className="text-sm font-bold tracking-widest uppercase mb-8">Admin CMS</h1>
        <nav className="flex-1 space-y-2">
          <Link to="/admin" className="block text-xs font-bold uppercase hover:text-[var(--accent)] transition-colors py-2 border-b border-[var(--border)]">Dashboard</Link>
          <Link to="/admin/profile" className="block text-xs font-bold uppercase hover:text-[var(--accent)] transition-colors py-2 border-b border-[var(--border)]">Profile</Link>
          <Link to="/admin/projects" className="block text-xs font-bold uppercase hover:text-[var(--accent)] transition-colors py-2 border-b border-[var(--border)]">Projects</Link>
          <Link to="/admin/posts" className="block text-xs font-bold uppercase hover:text-[var(--accent)] transition-colors py-2 border-b border-[var(--border)]">Posts / Activity</Link>
          <Link to="/admin/credentials" className="block text-xs font-bold uppercase hover:text-[var(--accent)] transition-colors py-2 border-b border-[var(--border)]">Credentials</Link>
          <Link to="/admin/journey" className="block text-xs font-bold uppercase hover:text-[var(--accent)] transition-colors py-2 border-b border-[var(--border)]">Journey / Work</Link>
          <Link to="/admin/beyond-code" className="block text-xs font-bold uppercase hover:text-[var(--accent)] transition-colors py-2 border-b border-[var(--border)]">Beyond Code (Now)</Link>
          <Link to="/admin/entities" className="block text-xs font-bold uppercase hover:text-[var(--accent)] transition-colors py-2 border-b border-[var(--border)]">Semantic Entities</Link>
          <Link to="/" className="block text-xs font-bold uppercase hover:text-[var(--accent)] transition-colors py-2 border-b border-[var(--border)] mt-8 text-[var(--text-secondary)]">View Public Site</Link>
        </nav>
        <button onClick={handleLogout} className="text-xs font-bold uppercase text-red-500 hover:text-red-400 py-2 border border-red-500/20 rounded-sm mt-4 text-center">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
