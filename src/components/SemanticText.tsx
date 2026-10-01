import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { SemanticTerm } from './SemanticTerm';

interface SemanticTextProps {
  text: string;
  className?: string;
}

export const SemanticText: React.FC<SemanticTextProps> = ({ text, className }) => {
  const { entities, searchQuery } = useStore();
  
  const parsedContent = useMemo(() => {
    if (!text) return null;
    
    // First, split by searchQuery if it exists
    let searchParts: {text: string, isSearchMatch: boolean}[] = [{ text, isSearchMatch: false }];
    
    if (searchQuery && searchQuery.trim().length > 0) {
      const escapedQuery = searchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(`(${escapedQuery})`, 'gi');
      
      searchParts = [];
      const rawParts = text.split(searchRegex);
      rawParts.forEach((part, i) => {
        if (part) {
          searchParts.push({ text: part, isSearchMatch: i % 2 === 1 });
        }
      });
    }

    const activeEntities = entities.filter(e => e.enabled);
    const matchTerms: string[] = [];
    activeEntities.forEach(e => {
      matchTerms.push(e.name);
      e.aliases.forEach(alias => matchTerms.push(alias));
    });
    
    // Remove duplicates and sort by length descending to match longest phrases first
    const uniqueTerms = Array.from(new Set(matchTerms))
      .sort((a, b) => b.length - a.length)
      .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      
    const entityRegex = uniqueTerms.length > 0 
      ? new RegExp(`(?<=^|[^a-zA-Z0-9_])(${uniqueTerms.join('|')})(?=[^a-zA-Z0-9_]|$)`, 'gi')
      : null;

    return (
      <>
        {searchParts.map((sp, idx) => {
          if (sp.isSearchMatch) {
            return <mark key={`s-${idx}`} className="bg-yellow-400 text-black px-0.5 rounded-sm">{sp.text}</mark>;
          }
          
          if (!entityRegex) {
            return <React.Fragment key={`e-${idx}`}>{sp.text}</React.Fragment>;
          }
          
          const eParts = sp.text.split(entityRegex);
          return (
            <React.Fragment key={`e-${idx}`}>
              {eParts.map((part, i) => {
                // Regex split with capture group puts the matched group in odd indices
                if (i % 2 === 1) {
                  return <SemanticTerm key={i} term={part} mode="badge" />;
                }
                return <React.Fragment key={i}>{part}</React.Fragment>;
              })}
            </React.Fragment>
          );
        })}
      </>
    );
  }, [text, entities, searchQuery]);

  return (
    <span className={className}>
      {parsedContent}
    </span>
  );
};
