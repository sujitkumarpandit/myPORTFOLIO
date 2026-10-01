import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { useStore } from '../store/useStore';
import { SemanticText } from '../components/SemanticText';

export function Journey() {
  const journey = useStore(state => state.timeline);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono">
      <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
        <LeftSidebar />
      </div>

      <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 min-w-0">
        <div className="mb-4 pb-4 border-b border-[var(--border)]">
          <h1 className="font-bold text-3xl mb-2 tracking-tighter uppercase">CAREER JOURNEY</h1>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">A timeline of my professional progress and milestones.</p>
        </div>

        <div className="relative border-l border-[var(--border)] ml-3 sm:ml-6 space-y-12 pb-12 mt-4">
          {journey.map((event) => (
            <div key={event.id} className="relative pl-8 sm:pl-12 group">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-[var(--surface)] border-2 border-[var(--border)] group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] transition-colors rounded-full"></div>
              
              <div className="mb-3">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest bg-[var(--bg)] border border-[var(--border)] px-2 py-1 rounded-sm uppercase group-hover:text-[var(--text-primary)] transition-colors">
                  YEAR / {event.year}
                </span>
              </div>
              
              <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-sm hover:border-[var(--text-primary)] transition-colors">
                <h3 className="font-bold text-xl mb-3 group-hover:text-[var(--accent)] transition-colors uppercase tracking-tight">{event.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  <SemanticText text={event.description} />
                </p>
                <div className="mt-5 pt-4 border-t border-[var(--border)] flex gap-3 text-[10px] font-bold tracking-widest text-[var(--text-primary)] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>&gt; EXPAND_EVENT</span>
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
