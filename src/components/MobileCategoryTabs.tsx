import { useRef, useEffect } from 'react';

interface MobileCategoryTabsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  className?: string;
}

export function MobileCategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  className = ''
}: MobileCategoryTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto scroll active tab into view
  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedCategory]);

  return (
    <div className={`relative w-full ${className}`}>
      <div 
        ref={containerRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-0.5 scroll-smooth font-mono select-none"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              data-active={isSelected}
              onClick={() => onSelectCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider rounded-sm border transition-all active:scale-95 shrink-0 ${
                isSelected
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isSelected ? `[ ${cat} ]` : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
