const fs = require('fs');
let content = fs.readFileSync('src/components/LeftSidebar.tsx', 'utf8');

content = content.replace(
  `: \\\`text-[var(--text-secondary)] \${item.hoverBg} border border-transparent \${item.hoverColor}\\\``,
  `: \\\`text-[var(--text-secondary)] bg-[var(--surface)] \${item.hoverBg} border border-transparent \${item.hoverColor}\\\``
);

fs.writeFileSync('src/components/LeftSidebar.tsx', content);
