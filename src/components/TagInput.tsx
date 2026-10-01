import React, { useState } from 'react';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ label, tags, onChange, placeholder = "Type and press Enter..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="mb-4">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
        {label}
      </label>
      <div className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 flex flex-wrap gap-2 focus-within:border-[var(--accent)]">
        {tags.map((tag, index) => (
          <span key={index} className="bg-[var(--surface)] border border-[var(--border)] px-2 py-1 text-xs rounded-sm flex items-center gap-1">
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="text-[var(--text-secondary)] hover:text-red-500 font-bold ml-1">
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent text-sm text-[var(--text-primary)] outline-none"
        />
      </div>
    </div>
  );
}
