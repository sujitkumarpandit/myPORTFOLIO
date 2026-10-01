import React, { useRef, useState } from 'react';
import { uploadToSupabaseStorage } from '../lib/supabase';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  bucket?: string;
}

export function ImageUpload({
  label,
  value,
  onChange,
  accept = "image/*,video/*",
  bucket = "portfolio-assets",
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusMessage('Uploading to Supabase Storage...');

    try {
      const publicUrl = await uploadToSupabaseStorage(file, bucket, 'portfolio');
      onChange(publicUrl);
      setStatusMessage('Upload complete!');
      setTimeout(() => setStatusMessage(null), 2500);
    } catch (err: any) {
      console.error('Storage upload failure:', err);
      alert('Upload failed: ' + (err.message || 'Unknown error'));
      setStatusMessage(null);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="mb-4 font-mono">
      <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] block mb-1">
        {label}
      </label>
      <div className="flex flex-col gap-2">
        {value && (
          <div className="mb-2">
            {value.startsWith('data:video') || value.match(/\.(mp4|webm|ogg)$/i) ? (
              <video src={value} controls className="max-h-40 rounded-sm border border-[var(--border)]" />
            ) : (
              <img src={value} alt="Preview" className="max-h-40 object-cover rounded-sm border border-[var(--border)]" />
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept={accept}
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="px-4 py-2 border border-[var(--border)] text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[var(--surface)] disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload File (Supabase Storage)'}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-4 py-2 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-red-500/10"
            >
              Clear
            </button>
          )}
          {statusMessage && (
            <span className="text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase">
              {statusMessage}
            </span>
          )}
        </div>
        <p className="text-[10px] text-[var(--text-secondary)]">Or provide a URL:</p>
        <input 
          type="text" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-sm p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]" 
        />
      </div>
    </div>
  );
}
