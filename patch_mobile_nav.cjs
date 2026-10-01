const fs = require('fs');
let content = fs.readFileSync('src/components/TopNav.tsx', 'utf8');

content = content.replace(
  `          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">00 / OVERVIEW</Link>
          <Link to="/work" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">01 / WORK</Link>
          <Link to="/lab" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">02 / LAB</Link>
          <Link to="/credentials" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">03 / CREDENTIALS</Link>
          <Link to="/journey" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">04 / JOURNEY</Link>
          <Link to="/connect" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2">05 / CONNECT</Link>`,
  `          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">00 / OVERVIEW</Link>
          <Link to="/work" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">01 / WORK</Link>
          <Link to="/now" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">02 / NOW</Link>
          <Link to="/lab" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">03 / LAB</Link>
          <Link to="/credentials" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">04 / CREDENTIALS</Link>
          <Link to="/journey" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">05 / JOURNEY</Link>
          <Link to="/media" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">06 / MEDIA</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">07 / ABOUT</Link>
          <Link to="/connect" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2">08 / CONNECT</Link>`
);

fs.writeFileSync('src/components/TopNav.tsx', content);
