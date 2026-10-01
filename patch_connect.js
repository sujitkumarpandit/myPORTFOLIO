const fs = require('fs');
let content = fs.readFileSync('src/pages/Connect.tsx', 'utf8');

content = content.replace(
  `  const [copied, setCopied] = useState(false);`,
  `  const [copied, setCopied] = useState(false);\n  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');`
);

content = content.replace(
  `  const copyEmail = () => {`,
  `  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => {
      setFormState('success');
      setTimeout(() => setFormState('idle'), 4000);
    }, 1500);
  };\n\n  const downloadVCard = () => {
    const vcard = \`BEGIN:VCARD\\nVERSION:3.0\\nN:\${siteProfile.name}\\nORG:\${siteProfile.name}\\nTITLE:\${siteProfile.role}\\nEMAIL:\${siteProfile.email}\\nTEL:\${siteProfile.phone}\\nURL:\${window.location.origin}\\nEND:VCARD\`;
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact.vcf';
    a.click();
    URL.revokeObjectURL(url);
  };\n\n  const copyEmail = () => {`
);

content = content.replace(
  `        <div className="mb-8">\n          <h1 className="font-bold text-4xl mb-3 tracking-tighter uppercase">05 / CONNECT</h1>\n          <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest">Let's discuss opportunities, collaborations, or architecture.</p>\n        </div>`,
  `        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">\n          <div>\n            <h1 className="font-bold text-4xl mb-3 tracking-tighter uppercase">05 / CONNECT</h1>\n            <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest">Let's discuss opportunities, collaborations, or architecture.</p>\n          </div>\n          <button onClick={downloadVCard} className="px-4 py-2 border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors self-start sm:self-auto rounded-sm">\n            [ SAVE VCARD ]\n          </button>\n        </div>`
);

content = content.replace(
  `          <form className="space-y-6" onSubmit={e => e.preventDefault()}>`,
  `          <form className="space-y-6" onSubmit={handleFormSubmit}>`
);

content = content.replace(
  `                <input type="text" className="w-full`,
  `                <input required disabled={formState !== 'idle'} type="text" className="w-full disabled:opacity-50`
);

content = content.replace(
  `                <input type="email" className="w-full`,
  `                <input required disabled={formState !== 'idle'} type="email" className="w-full disabled:opacity-50`
);

content = content.replace(
  `              <select className="w-full`,
  `              <select disabled={formState !== 'idle'} className="w-full disabled:opacity-50`
);

content = content.replace(
  `              <textarea rows={5} className="w-full`,
  `              <textarea required disabled={formState !== 'idle'} rows={5} className="w-full disabled:opacity-50`
);

content = content.replace(
  `            <button className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity">\n              [ SEND MESSAGE ]\n            </button>`,
  `            <button disabled={formState !== 'idle'} className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-70 flex justify-center items-center gap-2">\n              {formState === 'idle' && '[ SEND MESSAGE ]'}\n              {formState === 'submitting' && 'SENDING...'}\n              {formState === 'success' && <><CheckCircle2 className="w-4 h-4" /> SENT</>}\n            </button>`
);

fs.writeFileSync('src/pages/Connect.tsx', content);
