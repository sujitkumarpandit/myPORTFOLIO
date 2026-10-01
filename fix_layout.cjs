const fs = require('fs');

const files = fs.readdirSync('src/pages').filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const content = fs.readFileSync(`src/pages/${file}`, 'utf8');
  let newContent = content;
  
  // Replace the RightSidebar wrapper with exactly col-span-3
  newContent = newContent.replace(/<div className="hidden lg:block lg:col-span-2 xl:col-span-2[^>]*">\s*<RightSidebar \/>/g, '<div className="hidden lg:block lg:col-span-3 xl:col-span-3">\n        <RightSidebar />');
  
  fs.writeFileSync(`src/pages/${file}`, newContent);
}
