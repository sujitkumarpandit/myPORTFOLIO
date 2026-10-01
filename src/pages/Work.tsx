import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { SemanticText } from '../components/SemanticText';
import { SemanticTerm } from '../components/SemanticTerm';
import { MobileCategoryTabs } from '../components/MobileCategoryTabs';
import { useState, useMemo } from 'react';
import { Share2, Check } from 'lucide-react';

export function Work() {
  const projects = useStore(state => state.projects);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>(['ALL']);
    projects.forEach(p => {
      if (p.category) cats.add(p.category.toUpperCase());
    });
    return Array.from(cats);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'ALL') return projects;
    return projects.filter(p => (p.category || '').toUpperCase() === selectedCategory);
  }, [projects, selectedCategory]);

  const handleShare = async (e: React.MouseEvent, project: any) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/work/${project.slug}`;
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
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 font-mono">
      <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
        <LeftSidebar />
      </div>

      <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 min-w-0">
        <div className="mb-2 pb-4 border-b border-[var(--border)]">
          <h1 className="font-bold text-2xl sm:text-3xl mb-1 sm:mb-2 tracking-tighter uppercase">FEATURED WORK</h1>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">A curated list of projects, systems, and experiments.</p>
        </div>

        {/* Filter Tabs for Quick Selection */}
        {categories.length > 1 && (
          <MobileCategoryTabs 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            className="mb-2"
          />
        )}

        <div className="flex flex-col gap-6 sm:gap-8">
          {filteredProjects.map((project, index) => (
            <div key={project.id} className="group bg-[var(--surface)] border border-[var(--border)] rounded-sm overflow-hidden hover:border-[var(--text-primary)] transition-all block shadow-xs">
              <div className="p-3 border-b border-[var(--border)] bg-[var(--bg)] flex justify-between items-center">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase group-hover:text-[var(--accent)] transition-colors">PROJECT / {String(index + 1).padStart(3, '0')}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-[var(--text-primary)] tracking-widest uppercase">{project.year}</span>
                  <button 
                    onClick={(e) => handleShare(e, project)}
                    aria-label="Share project"
                    className="p-1 hover:text-[var(--accent)] text-[var(--text-secondary)] transition-colors"
                  >
                    {copiedId === project.id ? <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              
              {project.heroImage && (
                <Link to={`/work/${project.slug}`} className="block w-full aspect-[16/9] sm:aspect-[2.2/1] overflow-hidden border-b border-[var(--border)] bg-[var(--bg)] relative group-hover:opacity-95 transition-opacity">
                  <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02]" />
                </Link>
              )}
              <div className="p-4 sm:p-6 md:p-8">
                <div className="flex justify-between items-start mb-3">
                  <Link to={`/work/${project.slug}`} className="hover:text-[var(--accent)] transition-colors">
                    <h3 className="font-bold text-xl sm:text-2xl uppercase tracking-tight">{project.title}</h3>
                  </Link>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6 max-w-2xl">
                  <SemanticText text={project.shortDescription} />
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 pt-4 sm:pt-6 border-t border-[var(--border)]">
                  <div>
                    <span className="block text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-1 sm:mb-2">ROLE</span>
                    <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">{project.role || 'ENGINEER'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-1 sm:mb-2">STACK</span>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {(project.technologies || []).slice(0, 6).map(tech => (
                        <SemanticTerm key={tech} term={tech} mode="button" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-4 sm:pt-6 border-t border-[var(--border)]">
                  <Link to={`/work/${project.slug}`} className="min-h-[38px] px-4 py-2 bg-[var(--text-primary)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:opacity-90 active:scale-95 transition-all inline-flex items-center justify-center">
                    [ VIEW_PROJECT ]
                  </Link>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="min-h-[38px] px-4 py-2 border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg)] text-[10px] font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-all inline-flex items-center justify-center">
                      SOURCE
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="min-h-[38px] px-4 py-2 border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg)] text-[10px] font-bold uppercase tracking-widest rounded-sm active:scale-95 transition-all inline-flex items-center justify-center">
                      LIVE_DEMO
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="p-8 text-center bg-[var(--surface)] border border-[var(--border)] rounded-sm text-xs text-[var(--text-secondary)] uppercase tracking-widest">
              No projects found matching category "{selectedCategory}".
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
        <RightSidebar />
      </div>
    </div>
  );
}
