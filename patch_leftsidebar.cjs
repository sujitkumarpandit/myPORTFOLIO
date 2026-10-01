const fs = require('fs');
let content = fs.readFileSync('src/components/LeftSidebar.tsx', 'utf8');

content = content.replace(
  `const navItems = [
  { label: 'overview', path: '/', icon: User },
  { label: 'work', path: '/work', icon: Briefcase },
  { label: 'projects', path: '/projects', icon: FolderGit2 },
  { label: 'activity', path: '/activity', icon: Activity },
  { label: 'building', path: '/building', icon: Hammer },
  { label: 'lab', path: '/lab', icon: FlaskConical },
  { label: 'journey', path: '/journey', icon: Map },
  { label: 'credentials', path: '/credentials', icon: Award },
  { label: 'media', path: '/media', icon: ImageIcon },
  { label: 'about', path: '/about', icon: MessageSquare },
];`,
  `const navItems = [
  { label: 'overview', path: '/' },
  { label: 'work', path: '/work' },
  { label: 'now', path: '/now' },
  { label: 'lab', path: '/lab' },
  { label: 'journey', path: '/journey' },
  { label: 'credentials', path: '/credentials' },
  { label: 'media', path: '/media' },
  { label: 'about', path: '/about' },
  { label: 'connect', path: '/connect' }
];`
);

fs.writeFileSync('src/components/LeftSidebar.tsx', content);
