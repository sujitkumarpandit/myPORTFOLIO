const fs = require('fs');
let content = fs.readFileSync('src/components/TopNav.tsx', 'utf8');

content = content.replace(
  `import { Search, Github, Linkedin, Moon, Sun, Mail } from 'lucide-react';`,
  `import { Search, Github, Linkedin, Moon, Sun, Menu, X } from 'lucide-react';`
);

content = content.replace(
  `export function TopNav() {`,
  `export function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);`
);

content = content.replace(
  `          <button className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors md:hidden">
            <Search className="w-5 h-5" />
          </button>`,
  `          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors lg:hidden">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>`
);

content = content.replace(
  `    </header>
  );
}`,
  `      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[var(--surface)] border-b border-[var(--border)] p-4 flex flex-col gap-4 shadow-xl z-50">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">00 / OVERVIEW</Link>
          <Link to="/work" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">01 / WORK</Link>
          <Link to="/lab" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">02 / LAB</Link>
          <Link to="/credentials" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">03 / CREDENTIALS</Link>
          <Link to="/journey" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2 border-b border-[var(--border)]">04 / JOURNEY</Link>
          <Link to="/connect" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] py-2">05 / CONNECT</Link>
          <div className="flex gap-4 pt-4 border-t border-[var(--border)]">
            <a href={siteProfile.social.github} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent)]">[ GITHUB ]</a>
            <a href={siteProfile.social.linkedin} target="_blank" rel="noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent)]">[ LINKEDIN ]</a>
          </div>
        </div>
      )}
    </header>
  );
}`
);

fs.writeFileSync('src/components/TopNav.tsx', content);
