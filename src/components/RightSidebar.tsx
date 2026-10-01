import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SemanticTerm } from './SemanticTerm';

export function RightSidebar() {
  const projects = useStore(state => state.projects);
  const credentials = useStore(state => state.credentials);
  const profile = useStore(state => state.profile);

  const currentlyBuilding = projects[0];
  const topCredential = credentials[0];

  if (!profile) return null;

  return (
    <div className="sidebar-sticky flex flex-col gap-6 font-mono pr-1 no-scrollbar">
      
      {/* Currently Building Widget */}
      {currentlyBuilding && (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">CURRENTLY BUILDING</h3>
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse"></span>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-tight">{currentlyBuilding.title}</h4>
            <p className="text-[10px] text-[var(--accent)] tracking-widest uppercase mt-0.5">STATUS / BUILDING</p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mb-0.5">PHASE</p>
            <p className="text-[10px] font-bold uppercase">Retrieval + Eval</p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mb-0.5">NEXT</p>
            <p className="text-[10px] font-bold uppercase">Evaluation pipeline</p>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-[var(--border)]">
          <Link to={`/work/${currentlyBuilding.slug}`} className="text-[10px] font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors flex items-center uppercase tracking-widest">
            &gt; VIEW_PROGRESS
          </Link>
        </div>
      </div>
      )}

      {/* GitHub Snapshot */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-4">
        <h3 className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-4">GITHUB SNAPSHOT</h3>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-[var(--bg)] border border-[var(--border)] p-2 rounded-sm text-center">
            <p className="text-xs font-bold text-[var(--text-primary)]">{projects.length + 5}</p>
            <p className="text-[8px] text-[var(--text-secondary)] tracking-widest uppercase">REPOS</p>
          </div>
          <div className="bg-[var(--bg)] border border-[var(--border)] p-2 rounded-sm text-center">
            <p className="text-xs font-bold text-[var(--text-primary)]">428</p>
            <p className="text-[8px] text-[var(--text-secondary)] tracking-widest uppercase">COMMITS</p>
          </div>
        </div>
        <a href={profile.social?.github || '#'} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors flex items-center uppercase tracking-widest">
          &gt; VIEW_PROFILE
        </a>
      </div>

      {/* Technical Profile Snippet */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-4">
        <h3 className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-4">TECHNICAL PROFILE</h3>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mb-1">LANGUAGES</p>
            <div className="flex flex-wrap gap-2">
              <SemanticTerm term="TypeScript" mode="button" />
              <SemanticTerm term="Python" mode="button" />
              <SemanticTerm term="SQL" mode="button" />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-secondary)] tracking-widest uppercase mb-1">FRAMEWORKS</p>
            <div className="flex flex-wrap gap-2">
              <SemanticTerm term="React" mode="button" />
              <SemanticTerm term="Node.js" mode="button" />
              <SemanticTerm term="Next.js" mode="button" />
            </div>
          </div>
        </div>
      </div>

      {/* Currently Learning */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-4">
        <h3 className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-4">LEARNING SYSTEM</h3>
        <ul className="space-y-2">
          <li className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase">System Design</span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 border border-[var(--border)] rounded-sm text-[var(--accent)] tracking-widest">BUILDING</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase">AI Agents</span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 border border-[var(--border)] rounded-sm text-[var(--text-secondary)] tracking-widest">APPLYING</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase">Advanced TS</span>
            <span className="text-[8px] font-bold px-1.5 py-0.5 border border-[var(--border)] rounded-sm text-[var(--text-secondary)] tracking-widest">LEARNING</span>
          </li>
        </ul>
      </div>

      {/* Quick Connect */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-4">
        <h3 className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-3">CONNECT</h3>
        <div className="flex flex-col gap-2">
          {profile.social?.linkedin && <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase bg-[var(--text-primary)] text-[var(--bg)] rounded-sm hover:opacity-90 transition-opacity text-center">[ LINKEDIN ]</a>}
          <div className="grid grid-cols-2 gap-2">
            <a href={`mailto:${profile.email}`} className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-center bg-[var(--bg)] border border-[var(--border)] rounded-sm hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] text-[var(--text-secondary)] transition-colors">EMAIL</a>
            {profile.social?.github && <a href={profile.social.github} target="_blank" rel="noreferrer" className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-center bg-[var(--bg)] border border-[var(--border)] rounded-sm hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] text-[var(--text-secondary)] transition-colors">GITHUB</a>}
          </div>
        </div>
      </div>
    </div>
  );
}
