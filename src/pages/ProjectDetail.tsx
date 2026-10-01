import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Share2, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { format } from 'date-fns';
import { SemanticText } from '../components/SemanticText';
import { SemanticTerm } from '../components/SemanticTerm';
import { useState } from 'react';

export function ProjectDetail() {
  const { slug } = useParams();
  const projects = useStore(state => state.projects);
  const posts = useStore(state => state.posts);
  const project = projects.find(p => p.slug === slug);
  const [copied, setCopied] = useState(false);

  if (!project) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center font-mono px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-[var(--accent)] mb-4 uppercase tracking-tighter">PROJECT_NOT_FOUND</h1>
      <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest mb-8">The requested project could not be located.</p>
      <div className="flex gap-4">
        <Link to="/work" className="px-6 py-3 bg-[var(--text-primary)] text-[var(--bg)] text-xs font-bold tracking-widest uppercase rounded-sm hover:opacity-90 transition-opacity">
          [ BACK TO WORK ]
        </Link>
      </div>
    </div>
  );

  const relatedPosts = posts.filter(post => post.relatedProjectId === project.id);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.shortDescription,
          url,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 font-mono">
      {/* Left Column */}
      <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
        <LeftSidebar />
      </div>

      {/* Center Column: Project Content */}
      <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 sm:gap-8 min-w-0">
        
        {/* Navigation & Header */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Link to="/work" className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase py-1">
              <ArrowLeft className="w-3.5 h-3.5" /> ./work
            </Link>
            <button 
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-sm text-[10px] font-bold tracking-widest uppercase hover:border-[var(--text-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[var(--accent)]" /> : <Share2 className="w-3 h-3" />}
              <span>{copied ? 'COPIED ✓' : 'SHARE'}</span>
            </button>
          </div>
          
          <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm p-4 sm:p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-[var(--border)] text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">
              <span className="text-[var(--accent)]">PROJECT / {project.year}</span>
              <span className="text-[var(--text-secondary)]">CATEGORY: {project.category}</span>
              <span className="text-[var(--text-secondary)]">ROLE: {project.role || 'ENGINEER'}</span>
            </div>
            
            <h1 className="font-bold text-2xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 tracking-tighter uppercase leading-tight">{project.title}</h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl">
              <SemanticText text={project.shortDescription} />
            </p>
          </div>
        </div>

        {/* Hero Visual */}
        {project.heroImage && (
          <div className="w-full aspect-[16/9] bg-[var(--surface)] border border-[var(--border)] rounded-sm overflow-hidden">
            <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover transition-all duration-500" />
          </div>
        )}

        {/* Action Bar */}
        <div className="flex flex-wrap gap-3 pb-6 border-b border-[var(--border)]">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-sm text-[10px] font-bold tracking-widest uppercase hover:border-[var(--text-primary)] active:scale-95 transition-all">
              <SemanticTerm term="GitHub" mode="icon" className="mr-1" /> [ REPOSITORY ]
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-[var(--text-primary)] text-[var(--bg)] border border-[var(--text-primary)] rounded-sm text-[10px] font-bold tracking-widest uppercase hover:bg-transparent hover:text-[var(--text-primary)] active:scale-95 transition-all">
              [ LIVE DEMO ]
            </a>
          )}
        </div>

        {/* Project Activity (Living Quality) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 bg-[var(--surface)] border border-[var(--border)] rounded-sm p-4">
          <div>
            <p className="text-[8px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-1">STATUS</p>
            <p className="text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase">ACTIVE</p>
          </div>
          <div>
            <p className="text-[8px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-1">LAST BUILD</p>
            <p className="text-[10px] font-bold text-[var(--text-primary)] tracking-widest uppercase">SEP 2026</p>
          </div>
          <div>
            <p className="text-[8px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-1">LATEST RELEASE</p>
            <p className="text-[10px] font-bold text-[var(--text-primary)] tracking-widest uppercase">v1.2.0</p>
          </div>
          <div>
            <p className="text-[8px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-1">UPDATES</p>
            <p className="text-[10px] font-bold text-[var(--text-primary)] tracking-widest uppercase">{relatedPosts.length} EVENTS</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-8 sm:gap-10 mt-2">
          <section>
            <h2 className="text-[10px] font-bold text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 tracking-widest uppercase mb-4">PROBLEM & APPROACH</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)] mb-2 uppercase tracking-widest">THE PROBLEM</p>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                  <SemanticText text={project.problem || 'Define the core problem space.'} />
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)] mb-2 uppercase tracking-widest">THE APPROACH</p>
                <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                  <SemanticText text={project.goal || 'Define the intended outcome.'} />
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 tracking-widest uppercase mb-4">ARCHITECTURE & IMPLEMENTATION</h2>
            <div className="bg-[var(--surface)] border border-[var(--border)] p-4 sm:p-6 rounded-sm mb-6">
              <p className="leading-relaxed text-xs sm:text-sm text-[var(--text-secondary)]">
                <SemanticText text={project.architecture || 'Detailed system design and architecture decisions.'} />
              </p>
            </div>
            
            <h3 className="text-[10px] font-bold text-[var(--text-primary)] mb-3 uppercase tracking-widest">TECHNICAL STACK</h3>
            <div className="flex flex-wrap gap-2">
              {(project.technologies || []).map(tech => (
                <SemanticTerm key={tech} term={tech} mode="button" />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-bold text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 tracking-widest uppercase mb-4">RESULTS & LESSONS</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              <SemanticText text={project.results || 'Document the outcomes and learnings.'} />
            </p>
          </section>

          {/* Related Activity Feed */}
          {relatedPosts.length > 0 && (
            <section className="pt-6 sm:pt-8 border-t border-[var(--border)]">
              <h2 className="text-[10px] font-bold text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 tracking-widest uppercase mb-4 sm:mb-6">PROJECT ACTIVITY</h2>
              <div className="flex flex-col gap-4">
                {relatedPosts.map(post => (
                  <div key={post.id} className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-sm flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase">
                      <span className="text-[var(--accent)]">[{post.type}]</span>
                      <span className="text-[var(--text-secondary)]">{format(new Date(post.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
                      <SemanticText text={post.content} />
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

      </div>

      {/* Right Column */}
      <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
        <RightSidebar />
      </div>
    </div>
  );
}
