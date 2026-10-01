import React from 'react';
import { useStore } from '../store/useStore';
import { IconResolver } from './IconResolver';

export type SemanticTermMode = 'subtle' | 'badge' | 'icon' | 'link' | 'button' | 'card';

interface SemanticTermProps {
  term: string;
  mode?: SemanticTermMode;
  className?: string;
  showIcon?: boolean;
  href?: string;
  onClick?: () => void;
  label?: string;
}

export const SemanticTerm: React.FC<SemanticTermProps> = ({ 
  term, 
  mode = 'subtle', 
  className = '', 
  showIcon = true,
  href,
  onClick,
  label
}) => {
  const { entities } = useStore();
  
  // Normalize term for matching
  const normalizedTerm = term.trim().toLowerCase();
  
  // Find entity
  const entity = entities.find(e => 
    e.enabled && (
      e.name.toLowerCase() === normalizedTerm || 
      e.aliases.some(alias => alias.toLowerCase() === normalizedTerm)
    )
  );
  
  if (!entity) {
    return <span className={className}>{term}</span>;
  }
  
  const isDark = document.documentElement.classList.contains('dark');
  const bgColor = isDark && entity.darkColor ? entity.darkColor : entity.color;
  const textColor = entity.textColor || '#ffffff';
  
  // Custom styles based on mode
  if (mode === 'subtle') {
    return (
      <span 
        className={`inline-flex items-center gap-1 font-medium px-1 rounded-sm transition-colors cursor-default ${className}`}
        style={{
          borderBottom: `2px solid ${bgColor}`,
        }}
        title={`${entity.name} - ${entity.category}`}
      >
        {showIcon && entity.icon && <IconResolver name={entity.icon} className="w-3 h-3" style={{ color: bgColor }} />}
        <span>{entity.name}</span>
      </span>
    );
  }
  
  if (mode === 'badge') {
    return (
      <span 
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm align-text-bottom mx-1 text-xs font-bold whitespace-nowrap transition-transform hover:-translate-y-0.5 ${className}`}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${bgColor}`
        }}
        title={`${entity.name} - ${entity.category}`}
      >
        {showIcon && entity.icon && <IconResolver name={entity.icon} className="w-3.5 h-3.5" />}
        {entity.name}
      </span>
    );
  }
  
  if (mode === 'icon') {
    return (
      <span 
        className={`inline-flex items-center justify-center ${className}`}
        title={entity.name}
        style={{ color: bgColor }}
      >
        {entity.icon ? (
          <IconResolver name={entity.icon} className="w-full h-full" style={{ color: bgColor }} />
        ) : (
          <span className="text-xs font-bold">{entity.name.slice(0, 2).toUpperCase()}</span>
        )}
      </span>
    );
  }
  
  if (mode === 'card') {
    const finalHref = href || entity.officialUrl;
    const Element = finalHref ? 'a' : (onClick ? 'button' : 'div');
    const props = finalHref ? {
      href: finalHref,
      target: '_blank',
      rel: 'noopener noreferrer',
      onClick
    } : { onClick };
    
    return (
      <Element
        {...(props as any)}
        className={`flex items-center gap-4 px-5 py-4 border rounded-sm transition-all duration-300 group text-left ${className}`}
        style={{
          backgroundColor: `${bgColor}0a`,
          borderColor: `${bgColor}40`,
        }}
        title={entity.name}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = bgColor;
          (e.currentTarget as HTMLElement).style.backgroundColor = `${bgColor}15`;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = `${bgColor}40`;
          (e.currentTarget as HTMLElement).style.backgroundColor = `${bgColor}0a`;
        }}
      >
        {showIcon && entity.icon && (
          <div className="group-hover:scale-110 transition-transform duration-300" style={{ color: bgColor }}>
            <IconResolver name={entity.icon} className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: bgColor }}>{entity.name}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">{label || 'Connect ↗'}</p>
        </div>
      </Element>
    );
  }
  
  if (mode === 'link' || mode === 'button') {
    const isButton = mode === 'button';
    const finalHref = href || entity.officialUrl;
    const Element = finalHref ? 'a' : (onClick ? 'button' : 'span');
    const props = finalHref ? {
      href: finalHref,
      target: '_blank',
      rel: 'noopener noreferrer',
      onClick
    } : { onClick };
    
    return (
      <Element
        {...props}
        className={`inline-flex items-center gap-2 transition-all duration-300 ${isButton ? 'px-4 py-2 rounded-lg font-medium hover:-translate-y-1' : 'hover:underline'} ${className}`}
        style={isButton ? {
          backgroundColor: bgColor,
          color: textColor,
          boxShadow: `0 4px 14px 0 ${bgColor}40`
        } : {
          color: bgColor
        }}
        title={entity.name}
      >
        {showIcon && entity.icon && <IconResolver name={entity.icon} className={isButton ? "w-5 h-5" : "w-4 h-4"} />}
        <span>{entity.name}</span>
        {finalHref && isButton && <span className="text-xs opacity-70 ml-1">↗</span>}
      </Element>
    );
  }
  
  return <span className={className}>{term}</span>;
};
