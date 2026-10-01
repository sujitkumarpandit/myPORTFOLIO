const fs = require('fs');
let content = fs.readFileSync('src/pages/Connect.tsx', 'utf8');

content = content.replace(
  `  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 4000);
    }, 1500);
  };`,
  `  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    // Use native mailto for guaranteed delivery without backend secrets
    const form = e.target as HTMLFormElement;
    const name = (form.elements[0] as HTMLInputElement).value;
    const email = (form.elements[1] as HTMLInputElement).value;
    const reason = (form.elements[2] as HTMLSelectElement).value;
    const message = (form.elements[3] as HTMLTextAreaElement).value;
    
    const subject = encodeURIComponent(\`Portfolio Contact: \${reason} from \${name}\`);
    const body = encodeURIComponent(\`Name: \${name}\\nEmail: \${email}\\n\\nMessage:\\n\${message}\`);
    
    window.location.href = \`mailto:\${siteProfile.email}?subject=\${subject}&body=\${body}\`;
    
    setTimeout(() => {
      setFormState('success');
      form.reset();
      setTimeout(() => setFormState('idle'), 4000);
    }, 1000);
  };`
);

fs.writeFileSync('src/pages/Connect.tsx', content);
