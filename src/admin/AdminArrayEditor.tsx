import React from 'react';

interface AdminArrayEditorProps<T> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, updateItem: (index: number, field: keyof T, value: string) => void) => React.ReactNode;
  defaultNewItem: T;
}

export function AdminArrayEditor<T>({ label, items, onChange, renderItem, defaultNewItem }: AdminArrayEditorProps<T>) {
  const addItem = () => {
    onChange([...items, { ...defaultNewItem }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof T, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  return (
    <div className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">{label}</label>
        <button
          type="button"
          onClick={addItem}
          className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest hover:opacity-80"
        >
          + ADD
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="relative border border-[var(--border)] p-3 rounded-sm bg-[var(--surface)]">
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-[var(--text-secondary)] hover:text-red-500 rounded-sm"
            >
              ×
            </button>
            <div className="pr-6 space-y-3">
              {renderItem(item, index, updateItem)}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-xs text-[var(--text-secondary)] italic">No items added yet.</div>
        )}
      </div>
    </div>
  );
}
