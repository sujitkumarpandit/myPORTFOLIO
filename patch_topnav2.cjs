const fs = require('fs');
let content = fs.readFileSync('src/components/TopNav.tsx', 'utf8');

// Brand text
content = content.replace(
  `text-[var(--text-primary)] uppercase flex items-center`,
  `text-white uppercase flex items-center`
);
content = content.replace(
  `caret-blink text-[var(--accent)] font-light`,
  `caret-blink text-blue-200 font-light`
);

// Status badge
content = content.replace(
  `bg-[var(--surface)] border border-[var(--border)] rounded-sm`,
  `bg-white/20 border border-white/30 rounded-sm`
);
content = content.replace(
  `text-[var(--text-secondary)]">STATUS:`,
  `text-white/80">STATUS:`
);
content = content.replace(
  `text-[var(--accent)] uppercase">{siteProfile.status}`,
  `text-white uppercase">{siteProfile.status}`
);

// Search input
content = content.replace(
  `text-[var(--accent)]">&gt;`,
  `text-gray-500">&gt;`
);
content = content.replace(
  `bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] text-sm rounded-sm pl-8 pr-4 py-2 focus:outline-none focus:border-[var(--text-primary)] transition-colors placeholder:text-[var(--text-secondary)]`,
  `bg-[#eef3f8] border border-transparent text-gray-900 text-sm rounded-sm pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors placeholder:text-gray-500`
);

// Action icons
content = content.replace(/text-\[var\(--text-secondary\)\] hover:text-\[var\(--text-primary\)\]/g, `text-white/80 hover:text-white`);

// Connect button
content = content.replace(
  `bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] text-sm font-bold rounded-sm hover:border-[var(--text-primary)] transition-colors uppercase tracking-wider`,
  `bg-white text-[#0a66c2] border border-transparent text-sm font-bold rounded-sm hover:bg-blue-50 transition-colors uppercase tracking-wider`
);

// Avatar border
content = content.replace(
  `w-8 h-8 rounded-sm bg-[var(--border)] overflow-hidden ml-2 border border-[var(--border)]`,
  `w-8 h-8 rounded-sm bg-white/20 overflow-hidden ml-2 border border-white/30`
);

// Mobile menu overlay - keep it surface-based as it overlays the page, not the header. But the menu trigger was updated above.

fs.writeFileSync('src/components/TopNav.tsx', content);
