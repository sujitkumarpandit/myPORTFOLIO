const fs = require('fs');

let content = fs.readFileSync('src/components/LeftSidebar.tsx', 'utf8');

const navItemsOriginal = `const navItems = [
  { label: 'overview', path: '/' },
  { label: 'work & projects', path: '/work' },
  { label: 'lab', path: '/lab' },
  { label: 'journey', path: '/journey' },
  { label: 'credentials', path: '/credentials' },
  { label: 'media', path: '/media' },
  { label: 'about', path: '/about' },
  { label: 'connect', path: '/connect' }
];`;

const navItemsNew = `const navItems = [
  { label: 'overview', path: '/', color: 'text-blue-500', hoverColor: 'group-hover:text-blue-500' },
  { label: 'work & projects', path: '/work', color: 'text-violet-500', hoverColor: 'group-hover:text-violet-500' },
  { label: 'lab', path: '/lab', color: 'text-pink-500', hoverColor: 'group-hover:text-pink-500' },
  { label: 'journey', path: '/journey', color: 'text-amber-500', hoverColor: 'group-hover:text-amber-500' },
  { label: 'credentials', path: '/credentials', color: 'text-emerald-500', hoverColor: 'group-hover:text-emerald-500' },
  { label: 'media', path: '/media', color: 'text-cyan-500', hoverColor: 'group-hover:text-cyan-500' },
  { label: 'about', path: '/about', color: 'text-rose-500', hoverColor: 'group-hover:text-rose-500' },
  { label: 'connect', path: '/connect', color: 'text-lime-500', hoverColor: 'group-hover:text-lime-500' }
];`;

content = content.replace(navItemsOriginal, navItemsNew);

// Replace link rendering
content = content.replace(
  `              className={\`group flex items-center gap-3 px-3 py-2 text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all duration-200 \${
                isActive 
                  ? 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] shadow-sm' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] border border-transparent hover:border-[var(--border)]'
              }\`}`,
  `              className={\`group flex items-center gap-3 px-3 py-2 text-[11px] font-bold uppercase tracking-widest rounded-sm transition-all duration-200 \${
                isActive 
                  ? \`bg-[var(--surface)] border border-[var(--border)] shadow-sm \${item.color}\`
                  : \`text-[var(--text-secondary)] hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)] \${item.hoverColor}\`
              }\`}`
);

content = content.replace(
  `<span className={\`text-[9px] transition-all duration-200 \${isActive ? 'text-[var(--accent)] scale-110' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}\`}>`,
  `<span className={\`text-[9px] transition-all duration-200 \${isActive ? \`scale-110 \${item.color}\` : \`text-[var(--text-secondary)] \${item.hoverColor}\`}\`}>`
);

// Replace footer links - Resume
content = content.replace(
  `className="group flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] rounded-sm transition-all border border-transparent hover:border-[var(--border)]"`,
  `className="group flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-orange-500 rounded-sm transition-all border border-transparent hover:border-[var(--border)]"`
);
content = content.replace(
  `<span className="text-[9px] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">↓</span>`,
  `<span className="text-[9px] text-[var(--text-secondary)] group-hover:text-orange-500 transition-colors">↓</span>`
);

// Replace footer links - GitHub
content = content.replace(
  `className="group flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] rounded-sm transition-all border border-transparent hover:border-[var(--border)]"`,
  `className="group flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-indigo-500 rounded-sm transition-all border border-transparent hover:border-[var(--border)]"`
);
// Make sure this doesn't replace the linkedIN one instead, or rather replace the first one for Github then next for linkedin
