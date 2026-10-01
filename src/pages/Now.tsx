import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { format } from 'date-fns';
import { SemanticText } from '../components/SemanticText';
import { BeyondCodeSection } from '../components/BeyondCodeSection';

export function Now() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/beyond-code' || location.hash === '#beyond-code') {
      const el = document.getElementById('beyond-code');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono">
      <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
        <LeftSidebar />
      </div>

      <div className="col-span-1 lg:col-span-7 flex flex-col gap-8">
        <div className="mb-2">
          <h1 className="font-bold text-4xl mb-3 tracking-tighter uppercase">07 / NOW</h1>
          <p className="text-sm text-[var(--text-secondary)] uppercase tracking-widest">Active initiatives, focus areas &amp; intellectual context.</p>
        </div>

        {/* Primary Professional Focus */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--border)]">
            <p className="text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase">
              LAST_UPDATED: {format(new Date(), 'yyyy.MM.dd')}
            </p>
            <span className="text-[9px] font-bold px-2 py-0.5 bg-[var(--bg)] border border-[var(--border)] text-[var(--accent)] tracking-widest uppercase">
              STATUS / ACTIVE
            </span>
          </div>
          
          <div className="space-y-10">
            <section>
              <h2 className="text-sm font-bold tracking-widest uppercase mb-3 text-[var(--accent)]">&gt; CURRENTLY_BUILDING</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed pl-4 border-l border-[var(--border)]">
                <SemanticText text="Developing the retrieval evaluation pipeline for Nexus Engine. The focus is on automating benchmark runs against standard corpuses to guarantee relevance scores remain above 90% as we scale." />
              </p>
            </section>
            
            <section>
              <h2 className="text-sm font-bold tracking-widest uppercase mb-3 text-[var(--accent)]">&gt; CURRENTLY_LEARNING</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed pl-4 border-l border-[var(--border)]">
                <SemanticText text="Diving deep into Advanced TypeScript patterns (Template Literal Types, Recursive Utility Types) to improve the type safety of my internal data structures without relying on runtime validation schemas everywhere." />
              </p>
            </section>
            
            <section>
              <h2 className="text-sm font-bold tracking-widest uppercase mb-3 text-[var(--accent)]">&gt; CURRENTLY_EXPLORING</h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed pl-4 border-l border-[var(--border)]">
                <SemanticText text="WebGL and custom fragment shaders. I want to bring highly performant, custom interactive textures to the web without heavy DOM overhead." />
              </p>
            </section>
          </div>
        </div>

        {/* 10% Personal Layer: Beyond Code */}
        <BeyondCodeSection />
      </div>

      <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
        <RightSidebar />
      </div>
    </div>
  );
}
