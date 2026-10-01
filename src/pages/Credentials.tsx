import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { useStore } from '../store/useStore';
import { ShieldCheck } from 'lucide-react';
import { SemanticText } from '../components/SemanticText';

export function Credentials() {
  const credentials = useStore(state => state.credentials);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono">
      <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
        <LeftSidebar />
      </div>

      <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 min-w-0">
        <div className="mb-4 pb-4 border-b border-[var(--border)]">
          <h1 className="font-bold text-3xl mb-2 tracking-tighter uppercase">CREDENTIALS</h1>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Verified certifications, degrees, and professional awards.</p>
        </div>

        <div className="flex flex-col gap-6">
          {credentials.map(cred => (
            <div key={cred.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-6 flex flex-col sm:flex-row gap-6 items-start hover:border-[var(--text-primary)] transition-colors group">
              <div className="w-16 h-16 bg-[var(--bg)] border border-[var(--border)] rounded-sm flex items-center justify-center flex-shrink-0 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors overflow-hidden">
                {cred.image ? (
                  <img src={cred.image} alt={cred.title} className="w-full h-full object-cover" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 rounded-sm group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-colors">{cred.type}</span>
                  {(cred as any).url && cred.verified && (
                    <a href={(cred as any).url} target="_blank" rel="noreferrer" className="text-[10px] font-bold tracking-widest uppercase hover:text-[var(--accent)] text-[var(--text-primary)] transition-colors">
                      [ VERIFY_CREDENTIAL ]
                    </a>
                  )}
                </div>
                <h3 className="font-bold text-xl mb-1 leading-tight uppercase tracking-tight">
                  <SemanticText text={cred.title} />
                </h3>
                <p className="text-sm font-bold text-[var(--text-secondary)] mb-4 uppercase tracking-wider">{cred.issuer}</p>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 border-t border-[var(--border)]">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-1">ISSUED</span>
                    <span className="text-[10px] font-bold text-[var(--text-primary)] tracking-widest uppercase">{cred.date}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-1">CREDENTIAL_ID</span>
                    <span className="text-[10px] font-bold text-[var(--text-primary)] tracking-widest uppercase">{cred.credentialId}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
        <RightSidebar />
      </div>
    </div>
  );
}
