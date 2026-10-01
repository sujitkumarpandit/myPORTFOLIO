import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useStore } from '../store/useStore';
import { SemanticText } from './SemanticText';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const projects = useStore(state => state.projects);
  const profile = useStore(state => state.profile);
  const beyondCode = useStore(state => state.beyondCode);
  const setBeyondCodeOpen = useStore(state => state.setBeyondCodeOpen);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      if (!isOpen) {
        if (e.key === 'g' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) && profile?.social?.github) {
          window.open(profile.social.github, '_blank');
        }
        if (e.key === 'l' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) && profile?.social?.linkedin) {
          window.open(profile.social.linkedin, '_blank');
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, profile]);

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery("");
    if (path === "OPEN_BEYOND_CODE") {
      setBeyondCodeOpen(true);
    } else if (path === "EXT_GITHUB" && profile?.social?.github) {
      window.open(profile.social.github, '_blank');
    } else if (path === "EXT_LINKEDIN" && profile?.social?.linkedin) {
      window.open(profile.social.linkedin, '_blank');
    } else {
      navigate(path);
    }
  };

  const publishedBeyondCode = (beyondCode || []).filter(item => item.published !== false);

  const commands = [
    { name: "Overview", path: "/" },
    { name: "Work", path: "/work" },
    { name: "Lab", path: "/lab" },
    { name: "Journey", path: "/journey" },
    { name: "Credentials", path: "/credentials" },
    { name: "Now", path: "/now" },
    { name: "Beyond Code (Reading & Topics)", path: "OPEN_BEYOND_CODE" },
    { name: "Connect", path: "/connect" },
    ...projects.map(p => ({ name: `Project: ${p.title}`, path: `/work/${p.slug}` })),
    ...publishedBeyondCode.map(bc => ({ 
      name: bc.type === 'BOOK' ? `Book: ${bc.title}` : `Beyond Code: ${bc.title}`, 
      path: "OPEN_BEYOND_CODE" 
    })),
    ...(profile?.social?.github ? [{ name: "GitHub", path: "EXT_GITHUB" }] : []),
    ...(profile?.social?.linkedin ? [{ name: "LinkedIn", path: "EXT_LINKEDIN" }] : [])
  ];

  const filteredCommands = commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--bg)]/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl rounded-sm overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 border-b border-[var(--border)] bg-[var(--bg)]">
              <span className="text-sm font-bold text-[var(--accent)] mr-3">&gt;</span>
              <input
                autoFocus
                type="text"
                placeholder="search_commands..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] text-sm font-bold uppercase tracking-wider placeholder:text-[var(--text-secondary)] placeholder:opacity-50"
              />
              <span className="text-[10px] font-bold text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--border)] px-2 py-1 rounded-sm uppercase tracking-widest">ESC</span>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-3">
              <div className="px-3 pb-2 pt-1 text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">
                AVAILABLE_ROUTES
              </div>
              {filteredCommands.length > 0 ? (
                filteredCommands.map((command, idx) => (
                  <button
                    key={command.path}
                    onClick={() => handleSelect(command.path)}
                    className="w-full text-left px-3 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[var(--bg)] border border-transparent hover:border-[var(--border)] rounded-sm flex justify-between items-center group transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">./</span>
                      <SemanticText text={command.name} />
                    </span>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      [ ENTER ]
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                  NO_RESULTS_FOUND
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
