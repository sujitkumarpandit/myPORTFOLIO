import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { useStore } from '../store/useStore';
import { Mail, Phone, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { SemanticTerm } from '../components/SemanticTerm';

export function Connect() {
  const profile = useStore(state => state.profile);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  if (!profile) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    // Use native mailto for guaranteed delivery without backend secrets
    const form = e.target as HTMLFormElement;
    const name = (form.elements[0] as HTMLInputElement).value;
    const email = (form.elements[1] as HTMLInputElement).value;
    const reason = (form.elements[2] as HTMLSelectElement).value;
    const message = (form.elements[3] as HTMLTextAreaElement).value;
    
    const subject = encodeURIComponent(`Portfolio Contact: ${reason} from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    
    setTimeout(() => {
      setFormState('success');
      form.reset();
      setTimeout(() => setFormState('idle'), 4000);
    }, 1000);
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nN:${profile.name}\nORG:${profile.name}\nTITLE:${profile.role}\nEMAIL:${profile.email}\nTEL:${profile.phone}\nURL:${window.location.origin}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact.vcf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono">
      <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
        <LeftSidebar />
      </div>

      <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 min-w-0">
        <div className="mb-4 pb-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-bold text-3xl mb-2 tracking-tighter uppercase">CONNECT</h1>
            <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Let's discuss opportunities, collaborations, or architecture.</p>
          </div>
          <button onClick={downloadVCard} className="px-4 py-2 border border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors self-start sm:self-auto rounded-sm">
            [ SAVE_VCARD ]
          </button>
        </div>

        {/* Professional Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-8 relative overflow-hidden">
          <h2 className="font-bold text-2xl mb-1 uppercase tracking-tight">{profile.name}</h2>
          <p className="text-[var(--text-secondary)] mb-8 text-[10px] uppercase tracking-widest">{profile.role}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={copyEmail} className="flex items-center gap-4 px-5 py-4 bg-[var(--bg)] border border-[var(--border)] rounded-sm hover:border-[var(--text-primary)] transition-colors text-left group">
              <Mail className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
              <div className="flex-1">
                <p className="text-[10px] text-[var(--text-secondary)] font-bold tracking-widest uppercase mb-1">EMAIL</p>
                <p className="text-xs font-bold uppercase tracking-wider">{copied ? 'COPIED ✓' : profile.email}</p>
              </div>
            </button>

            {profile.whatsapp && (
              <SemanticTerm 
                term="WhatsApp" 
                mode="card" 
                href={`https://wa.me/${profile.whatsapp.replace('+', '')}`} 
                label="Message ↗" 
              />
            )}
            
            {profile.phone && (
            <a href={`tel:${profile.phone}`} className="flex items-center gap-4 px-5 py-4 bg-[var(--bg)] border border-[var(--border)] rounded-sm hover:border-[var(--text-primary)] transition-colors group">
              <Phone className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
              <div>
                <p className="text-[10px] text-[var(--text-secondary)] font-bold tracking-widest uppercase mb-1">PHONE</p>
                <p className="text-xs font-bold uppercase tracking-wider">{profile.phone}</p>
              </div>
            </a>
            )}

            {profile.social?.linkedin && (
              <SemanticTerm 
                term="LinkedIn" 
                mode="card" 
                href={profile.social.linkedin} 
                label="Connect ↗" 
              />
            )}
            
            {profile.social?.github && (
              <SemanticTerm 
                term="GitHub" 
                mode="card" 
                href={profile.social.github} 
                label="View Profile ↗" 
              />
            )}
          </div>
        </div>

        {/* Contact Form Composer */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-8">
          <h3 className="text-[10px] font-bold text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 tracking-widest uppercase mb-6">SEND A DIRECT MESSAGE</h3>
          
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-2">NAME</label>
                <input required disabled={formState !== 'idle'} type="text" className="w-full disabled:opacity-50 bg-[var(--bg)] border border-[var(--border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-2">EMAIL</label>
                <input required disabled={formState !== 'idle'} type="email" className="w-full disabled:opacity-50 bg-[var(--bg)] border border-[var(--border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors" placeholder="jane@example.com" />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-2">REASON</label>
              <select disabled={formState !== 'idle'} className="w-full disabled:opacity-50 bg-[var(--bg)] border border-[var(--border)] rounded-sm px-4 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[var(--text-primary)] transition-colors appearance-none">
                <option>JOB OPPORTUNITY</option>
                <option>FREELANCE / CONTRACT</option>
                <option>COLLABORATION</option>
                <option>OPEN SOURCE</option>
                <option>GENERAL INQUIRY</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-2">MESSAGE</label>
              <textarea required disabled={formState !== 'idle'} rows={5} className="w-full disabled:opacity-50 bg-[var(--bg)] border border-[var(--border)] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[var(--text-primary)] transition-colors resize-none" placeholder="Message content..."></textarea>
            </div>

            <button disabled={formState !== 'idle'} className="px-8 py-3 bg-[var(--text-primary)] text-[var(--bg)] text-[10px] font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-70 flex justify-center items-center gap-2">
              {formState === 'idle' && '[ SEND_MESSAGE ]'}
              {formState === 'submitting' && 'SENDING...'}
              {formState === 'success' && <><CheckCircle2 className="w-4 h-4" /> SENT</>}
            </button>
          </form>
        </div>

      </div>

      <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
        <RightSidebar />
      </div>
    </div>
  );
}
