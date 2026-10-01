import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Activity, User, Send, Menu, X, Award, Clock, Beaker, Film, Shield, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';

export function MobileBottomNav() {
  const location = useLocation();
  const [showDrawer, setShowDrawer] = useState(false);
  const isAdmin = useAuthStore(state => state.isAdmin);
  const setBeyondCodeOpen = useStore(state => state.setBeyondCodeOpen);

  const mainNavItems = [
    { label: 'HOME', path: '/', icon: Home },
    { label: 'WORK', path: '/work', icon: Layers },
    { label: 'JOURNEY', path: '/journey', icon: Activity },
    { label: 'ABOUT', path: '/about', icon: User },
    { label: 'CONNECT', path: '/connect', icon: Send },
  ];

  const drawerItems = [
    { label: 'CREDENTIALS', path: '/credentials', icon: Award, desc: 'Verified certifications & degrees' },
    { label: 'NOW', path: '/now', icon: Clock, desc: 'Current focus & builds' },
    { label: 'BEYOND CODE', action: () => setBeyondCodeOpen(true), icon: BookOpen, desc: 'Active reading, topics & curiosity' },
    { label: 'LAB', path: '/lab', icon: Beaker, desc: 'Experiments & prototypes' },
    { label: 'MEDIA', path: '/media', icon: Film, desc: 'Talks & media gallery' },
    ...(isAdmin ? [{ label: 'ADMIN CMS', path: '/admin', icon: Shield, desc: 'Content Management' }] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Slide-over Drawer for Extra Pages */}
      {showDrawer && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end lg:hidden animate-in fade-in duration-200"
          onClick={() => setShowDrawer(false)}
        >
          <div 
            className="bg-[var(--surface)] border-t border-[var(--border)] rounded-t-xl p-6 pb-10 space-y-4 max-h-[80vh] overflow-y-auto font-mono safe-bottom shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">[ NAVIGATION_INDEX ]</span>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Extended modules</p>
              </div>
              <button 
                onClick={() => setShowDrawer(false)}
                aria-label="Close menu"
                className="w-8 h-8 flex items-center justify-center border border-[var(--border)] rounded-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Links Grid */}
            <div className="grid grid-cols-1 gap-2 pt-2">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const active = item.path ? isActive(item.path) : false;
                
                if (item.action) {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setShowDrawer(false);
                        item.action();
                      }}
                      className="flex items-center gap-3 p-3.5 rounded-sm border transition-all active:scale-[0.99] text-left bg-[var(--bg)]/50 border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--text-primary)] cursor-pointer w-full"
                    >
                      <div className="p-2 rounded-sm bg-[var(--surface)] text-[var(--accent)]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold tracking-wider uppercase text-[var(--text-primary)]">{item.label}</div>
                        <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-tight">{item.desc}</div>
                      </div>
                      <span className="text-[10px] text-[var(--accent)] font-bold tracking-widest">[OPEN]</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path!}
                    onClick={() => setShowDrawer(false)}
                    className={`flex items-center gap-3 p-3.5 rounded-sm border transition-all active:scale-[0.99] ${
                      active 
                        ? 'bg-[var(--bg)] border-[var(--accent)] text-[var(--accent)]' 
                        : 'bg-[var(--bg)]/50 border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                    }`}
                  >
                    <div className={`p-2 rounded-sm ${active ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface)] text-[var(--text-secondary)]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold tracking-wider uppercase">{item.label}</div>
                      <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-tight">{item.desc}</div>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)] font-bold tracking-widest">↗</span>
                  </Link>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowDrawer(false)}
              className="w-full py-3 mt-4 text-xs font-bold uppercase tracking-widest bg-[var(--bg)] border border-[var(--border)] rounded-sm text-[var(--text-secondary)] active:bg-[var(--surface)]"
            >
              [ CLOSE_MENU ]
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Sticky Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] safe-bottom lg:hidden font-mono shadow-lg select-none"
      >
        <div className="grid grid-cols-6 items-center px-1 py-1 max-w-lg mx-auto">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center min-h-[50px] py-1.5 px-1 rounded-sm transition-all active:scale-90 tap-highlight-transparent relative ${
                  active 
                    ? 'text-[var(--accent)] font-bold' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {active && (
                  <span className="absolute top-0.5 w-6 h-0.5 bg-[var(--accent)] rounded-full animate-in fade-in" />
                )}
                <Icon className={`w-4 h-4 mb-1 transition-transform ${active ? 'scale-110' : ''}`} />
                <span className="text-[8px] tracking-wider uppercase truncate max-w-full">{item.label}</span>
              </Link>
            );
          })}

          {/* More Drawer Button */}
          <button
            onClick={() => setShowDrawer(true)}
            aria-label="Open full menu"
            className={`flex flex-col items-center justify-center min-h-[50px] py-1.5 px-1 rounded-sm transition-all active:scale-90 tap-highlight-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]`}
          >
            <Menu className="w-4 h-4 mb-1" />
            <span className="text-[8px] tracking-wider uppercase">MORE</span>
          </button>
        </div>
      </nav>
    </>
  );
}
