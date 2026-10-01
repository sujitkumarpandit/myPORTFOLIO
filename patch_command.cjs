const fs = require('fs');
let content = fs.readFileSync('src/components/CommandPalette.tsx', 'utf8');

content = content.replace(
  `import { Search } from "lucide-react";`,
  `import { Search } from "lucide-react";\nimport { projects, credentials } from '../data';\nimport { siteProfile } from '../data';`
);

content = content.replace(
  `  const commands = [
    { name: "Overview", path: "/" },
    { name: "Work", path: "/work" },
    { name: "Lab", path: "/lab" },
    { name: "Journey", path: "/journey" },
    { name: "Credentials", path: "/credentials" },
    { name: "Now", path: "/now" },
    { name: "Connect", path: "/connect" },
  ];`,
  `  const commands = [
    { name: "Overview", path: "/" },
    { name: "Work", path: "/work" },
    { name: "Lab", path: "/lab" },
    { name: "Journey", path: "/journey" },
    { name: "Credentials", path: "/credentials" },
    { name: "Now", path: "/now" },
    { name: "Connect", path: "/connect" },
    ...projects.map(p => ({ name: \`Project: \${p.title}\`, path: \`/work/\${p.slug}\` })),
    { name: "GitHub", path: "EXT_GITHUB" },
    { name: "LinkedIn", path: "EXT_LINKEDIN" }
  ];`
);

content = content.replace(
  `  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery("");
    navigate(path);
  };`,
  `  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery("");
    if (path === "EXT_GITHUB") {
      window.open(siteProfile.social.github, '_blank');
    } else if (path === "EXT_LINKEDIN") {
      window.open(siteProfile.social.linkedin, '_blank');
    } else {
      navigate(path);
    }
  };`
);

fs.writeFileSync('src/components/CommandPalette.tsx', content);
