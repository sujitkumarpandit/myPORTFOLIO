const fs = require('fs');
let content = fs.readFileSync('src/pages/Credentials.tsx', 'utf8');

content = content.replace(
  `{cred.verified && (
                <button className="w-full sm:w-auto px-5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-sm text-xs font-bold tracking-widest uppercase hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] text-[var(--text-secondary)] transition-colors flex items-center justify-center gap-2">
                  [ VERIFY ]
                </button>
              )}`,
  `{(cred as any).url && cred.verified && (
                <a href={(cred as any).url} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-5 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-sm text-xs font-bold tracking-widest uppercase hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] text-[var(--text-secondary)] transition-colors flex items-center justify-center gap-2">
                  [ VERIFY ]
                </a>
              )}`
);

fs.writeFileSync('src/pages/Credentials.tsx', content);
