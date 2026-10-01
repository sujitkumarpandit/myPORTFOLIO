import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { SemanticTerm } from './SemanticTerm';

const navItems = [
  { label: 'overview', path: '/', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-500', border: 'border-blue-700' },
  { label: 'work & projects', path: '/work', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-violet-600', hoverBg: 'hover:bg-violet-500', border: 'border-violet-700' },
  { label: 'lab', path: '/lab', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-pink-600', hoverBg: 'hover:bg-pink-500', border: 'border-pink-700' },
  { label: 'journey', path: '/journey', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-amber-600', hoverBg: 'hover:bg-amber-500', border: 'border-amber-700' },
  { label: 'credentials', path: '/credentials', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-emerald-600', hoverBg: 'hover:bg-emerald-500', border: 'border-emerald-700' },
  { label: 'media', path: '/media', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-cyan-600', hoverBg: 'hover:bg-cyan-500', border: 'border-cyan-700' },
  { label: 'about', path: '/about', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-rose-600', hoverBg: 'hover:bg-rose-500', border: 'border-rose-700' },
  { label: '  ↳ skills', path: '/about#skills', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-rose-500', hoverBg: 'hover:bg-rose-400', border: 'border-rose-600' },
  { label: '  ↳ experience', path: '/about#experience', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-rose-500', hoverBg: 'hover:bg-rose-400', border: 'border-rose-600' },
  { label: '  ↳ qualifications', path: '/about#qualifications', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-rose-500', hoverBg: 'hover:bg-rose-400', border: 'border-rose-600' },
  { label: 'connect', path: '/connect', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-lime-600', hoverBg: 'hover:bg-lime-500', border: 'border-lime-700' },
  { label: 'beyond code', path: '/beyond-code', color: 'text-white', hoverColor: 'group-hover:text-white', bg: 'bg-teal-600', hoverBg: 'hover:bg-teal-500', border: 'border-teal-700' }
];

export function LeftSidebar() {
  const location = useLocation();
  const profile = useStore(state => state.profile);

  if (!profile) return <div className="hidden lg:block lg:col-span-3"></div>;

  return (
    <div className="sidebar-sticky flex flex-col font-mono pr-1 select-none no-scrollbar">
      
      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-3 py-2 mb-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest border-b border-[var(--border)]">
          <span>Directory</span>
          <span className="opacity-50">/ {navItems.length.toString().padStart(2, '0')}</span>
        </div>
        
        {navItems.map((item) => {
          const currentFull = location.pathname + location.hash;
          let isActive = false;
          if (item.path.includes('#')) {
             isActive = currentFull === item.path;
          } else {
             isActive = location.pathname === item.path && (!location.hash || !item.path.includes('/about'));
          }

          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`group flex items-center gap-3 px-3 py-2 text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all duration-200 ${
                isActive 
                  ? `${item.bg} border ${item.border} shadow-sm ${item.color}` 
                  : `text-[var(--text-secondary)] bg-[var(--surface)] ${item.hoverBg} border border-transparent ${item.hoverColor}`
              }`}
            >
              <span className={`text-[9px] transition-all duration-200 ${isActive ? `scale-110 ${item.color}` : `text-[var(--text-secondary)] ${item.hoverColor}`}`}>
                {isActive ? '■' : '▶'}
              </span>
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* External Links */}
      <div className="mt-6 flex flex-col gap-1">
        <div className="flex items-center justify-between px-3 py-2 mb-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest border-b border-[var(--border)]">
          <span>External</span>
          <span className="opacity-50">/ LNK</span>
        </div>
        
        {profile.resumeUrl && (
          <a href={profile.resumeUrl} target="_blank" rel="noreferrer" className="group flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-orange-500 hover:text-white rounded-sm transition-all border border-transparent">
            <span className="flex items-center gap-3">
              <span className="text-[9px] text-[var(--text-secondary)] group-hover:text-white transition-colors">↓</span> 
              RESUME
            </span>
            <span className="text-[9px] text-[var(--text-secondary)]">PDF</span>
          </a>
        )}

        {profile.social?.github && (
          <a href={profile.social.github} target="_blank" rel="noreferrer" className="group flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-indigo-500 hover:text-white rounded-sm transition-all border border-transparent">
             <span className="flex items-center gap-3">
              <span className="text-[9px] text-[var(--text-secondary)] group-hover:text-white transition-colors">↗</span> 
              GITHUB
            </span>
            <span className="text-[9px] text-[var(--text-secondary)]">EXT</span>
          </a>
        )}

        {profile.social?.linkedin && (
          <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="group flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-sky-500 hover:text-white rounded-sm transition-all border border-transparent">
             <span className="flex items-center gap-3">
              <span className="text-[9px] text-[var(--text-secondary)] group-hover:text-white transition-colors">↗</span> 
              LINKEDIN
            </span>
            <span className="text-[9px] text-[var(--text-secondary)]">EXT</span>
          </a>
        )}
      </div>

    </div>
  );
}
