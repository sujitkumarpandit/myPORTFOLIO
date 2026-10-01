import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 350px or more
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      id="floating-back-to-top"
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-1.5 px-3 py-2 bg-[var(--surface)]/90 backdrop-blur-sm border border-[var(--border)] hover:border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg)] rounded-sm text-[10px] font-mono font-bold tracking-widest uppercase shadow-lg transition-all duration-200 active:scale-95 group animate-in fade-in slide-in-from-bottom-3"
    >
      <ArrowUp className="w-3.5 h-3.5 text-[var(--accent)] group-hover:text-[var(--bg)] transition-colors" />
      <span className="hidden sm:inline">[ TOP ↑ ]</span>
    </button>
  );
}
