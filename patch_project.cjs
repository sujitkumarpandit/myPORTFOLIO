const fs = require('fs');
let content = fs.readFileSync('src/pages/ProjectDetail.tsx', 'utf8');

content = content.replace(
  `  if (!project) return <div>Project not found</div>;`,
  `  if (!project) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-[var(--accent)] mb-4 uppercase tracking-tighter">PROJECT_NOT_FOUND</h1>
      <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest mb-12">The requested project could not be located.</p>
      <div className="flex gap-4">
        <Link to="/work" className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity">
          [ BACK TO WORK ]
        </Link>
      </div>
    </div>
  );`
);

fs.writeFileSync('src/pages/ProjectDetail.tsx', content);
