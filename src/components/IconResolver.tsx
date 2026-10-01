import React from 'react';
import * as SiIcons from 'react-icons/si';
import * as FaIcons from 'react-icons/fa';
import * as LucideIcons from 'lucide-react';

interface IconResolverProps {
  name?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const IconResolver: React.FC<IconResolverProps> = ({ name, className, style }) => {
  if (!name) return null;
  
  if (name.startsWith('Si')) {
    const Icon = (SiIcons as any)[name];
    if (Icon) return <Icon className={className} style={style} />;
  }
  
  if (name.startsWith('Fa')) {
    const Icon = (FaIcons as any)[name];
    if (Icon) return <Icon className={className} style={style} />;
  }
  
  const LucideIcon = (LucideIcons as any)[name];
  if (LucideIcon) return <LucideIcon className={className} style={style} />;
  
  return null;
};
