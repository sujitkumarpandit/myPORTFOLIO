const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace(
  `import { Link } from 'react-router-dom';`,
  `import { Link } from 'react-router-dom';\nimport { useState } from 'react';`
);

content = content.replace(
  `export function Home() {`,
  `export function Home() {\n  const [localFeed, setLocalFeed] = useState(feed);\n  const [postContent, setPostContent] = useState('');\n  const [isPublishing, setIsPublishing] = useState(false);\n\n  const handlePublish = () => {\n    if (!postContent.trim()) return;\n    setIsPublishing(true);\n    setTimeout(() => {\n      const newPost = {\n        id: \`a-\${Date.now()}\`,\n        type: 'BUILD_UPDATE',\n        date: new Date().toISOString(),\n        content: postContent,\n        tags: ['Draft']\n      };\n      setLocalFeed([newPost, ...localFeed]);\n      setPostContent('');\n      setIsPublishing(false);\n    }, 800);\n  };`
);

content = content.replace(
  `          <div className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-3 text-sm text-[var(--text-secondary)] mb-4 cursor-text flex items-center">\n            <span className="text-[var(--accent)] mr-2">&gt;</span> Write an update...\n          </div>`,
  `          <div className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-3 text-sm text-[var(--text-secondary)] mb-4 flex items-start">\n            <span className="text-[var(--accent)] mr-2 mt-0.5">&gt;</span>\n            <textarea \n              className="bg-transparent border-none outline-none w-full resize-none text-[var(--text-primary)] disabled:opacity-50" \n              placeholder="Write an update..." \n              rows={2}\n              value={postContent}\n              disabled={isPublishing}\n              onChange={(e) => setPostContent(e.target.value)}\n            />\n          </div>`
);

content = content.replace(
  `            <button className="px-4 py-1.5 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90 transition-opacity">\n              [ PUBLISH ]\n            </button>`,
  `            <button \n              onClick={handlePublish} \n              disabled={isPublishing || !postContent.trim()} \n              className="px-4 py-1.5 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"\n            >\n              {isPublishing ? 'PUBLISHING...' : '[ PUBLISH ]'}\n            </button>`
);

content = content.replace(
  `{feed.map((post) => (`,
  `{localFeed.map((post) => (`
);

content = content.replace(
  `Link to={\`/projects/\${post.relatedProjectId}\`}`,
  `Link to={\`/work/\${post.relatedProjectId}\`}`
);

fs.writeFileSync('src/pages/Home.tsx', content);
