import { Link } from 'react-router-dom';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { siteProfile } from '../data';
import { useEffect, useState } from 'react';
import { SemanticTerm } from './SemanticTerm';
import { useStore } from '../store/useStore';

export function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const searchQuery = useStore(state => state.searchQuery);
  const setSearchQuery = useStore(state => state.setSearchQuery);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] text-[var(--text-primary)] w-full h-14 flex items-center justify-center font-mono transition-colors">
      <div className="w-full max-w-7xl px-4 md:px-6 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-4 w-1/3">
          <Link to="/" className="font-bold text-sm tracking-widest uppercase flex items-center hover:text-[var(--accent)] transition-colors">
            {siteProfile.name.split(' ')[0]}<span className="caret-blink text-[var(--text-secondary)] font-light">_</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 px-2 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded-sm">
            <span className="text-[10px] font-bold text-[var(--text-secondary)]">STATUS:</span>
            <span className="text-[10px] font-bold text-[var(--accent)] uppercase">{siteProfile.status}</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className="w-1/3 flex justify-center">
          <div className="relative w-full max-w-md hidden md:block group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors">&gt;</span>
            <input 
              type="text" 
              placeholder="SEARCH..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest rounded-sm pl-8 pr-4 py-1.5 focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-secondary)] uppercase"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="w-1/3 flex items-center justify-end gap-2 md:gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors lg:hidden">
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          
          <a href={siteProfile.social.github} target="_blank" rel="noreferrer" className="p-1.5 transition-colors hidden sm:block hover:opacity-80">
            <SemanticTerm term="GitHub" mode="icon" className="w-4 h-4" />
          </a>
          
          <a href={siteProfile.social.linkedin} target="_blank" rel="noreferrer" className="p-1.5 transition-colors hidden sm:block hover:opacity-80">
            <SemanticTerm term="LinkedIn" mode="icon" className="w-4 h-4" />
          </a>

          <button onClick={toggleTheme} className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link to="/connect" className="hidden md:flex items-center gap-2 px-3 py-1 bg-[var(--text-primary)] text-[var(--bg)] text-[10px] font-bold rounded-sm hover:opacity-90 transition-opacity uppercase tracking-widest">
            [ CONNECT ]
          </Link>
        </div>
      </div>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-[var(--surface)] border-b border-[var(--border)] p-4 flex flex-col gap-4 shadow-xl z-50">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)] hover:text-[var(--accent)] transition-colors">OVERVIEW</Link>
          <Link to="/work" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)] hover:text-[var(--accent)] transition-colors">WORK</Link>
          <Link to="/projects" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)] hover:text-[var(--accent)] transition-colors">PROJECTS</Link>
          <Link to="/activity" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)] hover:text-[var(--accent)] transition-colors">ACTIVITY</Link>
          <Link to="/repositories" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)] hover:text-[var(--accent)] transition-colors">REPOSITORIES</Link>
          <Link to="/credentials" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)] hover:text-[var(--accent)] transition-colors">CREDENTIALS</Link>
          <Link to="/journey" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)] hover:text-[var(--accent)] transition-colors">JOURNEY</Link>
          <Link to="/media" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)] hover:text-[var(--accent)] transition-colors">MEDIA</Link>
          <Link to="/connect" onClick={() => setMobileMenuOpen(false)} className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 hover:text-[var(--accent)] transition-colors">CONNECT</Link>
          <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
            <SemanticTerm term="GitHub" mode="link" href={siteProfile.social.github} className="text-[10px] font-bold uppercase tracking-widest" />
            <SemanticTerm term="LinkedIn" mode="link" href={siteProfile.social.linkedin} className="text-[10px] font-bold uppercase tracking-widest" />
          </div>
        </div>
      )}
    </header>
  );
}
