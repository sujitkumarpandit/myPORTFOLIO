import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-8xl font-bold text-[var(--accent)] mb-4 uppercase tracking-tighter">404</h1>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-8 uppercase tracking-widest">PAGE NOT FOUND</h2>
      <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest mb-12 max-w-md">
        The requested resource could not be located. It may have been moved or deleted.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/" className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity">
          [ BACK HOME ]
        </Link>
        <Link to="/work" className="px-6 py-3 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-sm hover:border-[var(--text-primary)] transition-colors">
          [ VIEW WORK ]
        </Link>
        <Link to="/connect" className="px-6 py-3 bg-transparent border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-widest uppercase rounded-sm hover:border-[var(--text-primary)] transition-colors">
          [ CONTACT ]
        </Link>
      </div>
    </div>
  );
}
