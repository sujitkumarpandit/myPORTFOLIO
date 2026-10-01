import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Send, Check, MessageSquare } from 'lucide-react';

const CATEGORIES = [
  { id: 'UX_UI', label: 'UX / UI' },
  { id: 'ARCHITECTURE', label: 'ARCHITECTURE' },
  { id: 'PERFORMANCE', label: 'PERFORMANCE' },
  { id: 'FEATURE', label: 'FEATURE IDEA' },
  { id: 'BUG', label: 'BUG REPORT' },
  { id: 'GENERAL', label: 'GENERAL' },
];

const SEVERITIES = [
  { id: 'LOW', label: 'SUGGESTION' },
  { id: 'MEDIUM', label: 'IMPROVEMENT' },
  { id: 'HIGH', label: 'HIGH PRIORITY' },
];

export function Feedback() {
  const [category, setCategory] = useState('UX_UI');
  const [severity, setSeverity] = useState('MEDIUM');
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getVisitorId = () => {
    let vid = localStorage.getItem('visitorId');
    if (!vid) {
      vid = `guest_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('visitorId', vid);
    }
    return vid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const feedbackId = `fb_${Date.now()}`;
    const visitorId = getVisitorId();

    try {
      if (isSupabaseConfigured()) {
        const { error: insertError } = await supabase
          .from('feedback')
          .insert({
            id: feedbackId,
            category,
            severity,
            content: content.trim(),
            contact: contact.trim() || null,
            visitorId,
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.warn('Supabase feedback insert error:', insertError);
        }
      }

      // Local persistence fallback
      try {
        const local = JSON.parse(localStorage.getItem('pending_feedback') || '[]');
        local.push({
          id: feedbackId,
          category,
          severity,
          content: content.trim(),
          contact: contact.trim() || null,
          visitorId,
          created_at: new Date().toISOString()
        });
        localStorage.setItem('pending_feedback', JSON.stringify(local));
      } catch (e) {
        // ignore
      }

      setSubmittedId(feedbackId);
      setContent('');
      setContact('');
    } catch (err: any) {
      console.error('Feedback submit error:', err);
      setError('Could not submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedId(null);
    setError(null);
    setContent('');
  };

  return (
    <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-sm font-mono overflow-hidden shadow-xs">
      {/* Header Bar */}
      <div className="p-3 sm:p-4 border-b border-[var(--border)] bg-[var(--bg)]/70 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-[var(--accent)]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">
            FEEDBACK &amp; IMPROVEMENT DISPATCH
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-bold tracking-widest text-[var(--text-secondary)] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
          <span>STATUS: DISPATCH_READY</span>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {submittedId ? (
          <div className="p-5 bg-[var(--bg)] border border-[var(--accent)] rounded-sm flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                <Check className="w-4 h-4" /> [ TRANSMISSION_CONFIRMED ]
              </span>
              <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">
                REF: #{submittedId.slice(-6).toUpperCase()}
              </span>
            </div>
            
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your points of improvement have been recorded into the system. Thank you for contributing to better architecture and interface polish.
            </p>

            <div className="pt-2 flex justify-start">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--text-primary)] text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest rounded-sm active:scale-95 transition-all"
              >
                [ SUBMIT ANOTHER POINT ]
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Have suggestions, architectural critiques, UI bugs, or feature improvements? Dispatch your notes directly below:
            </p>

            {/* Category Selectors */}
            <div>
              <label className="block text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5">
                POINT CATEGORY:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all border ${
                      category === cat.id
                        ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)] shadow-xs'
                        : 'bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority / Severity */}
            <div>
              <label className="block text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5">
                SCOPE / IMPACT:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SEVERITIES.map(sev => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setSeverity(sev.id)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all border ${
                      severity === sev.id
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs'
                        : 'bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="feedback-content" className="text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  POINTS OF IMPROVEMENT / SUGGESTIONS:
                </label>
                <span className="text-[9px] text-[var(--text-secondary)] font-bold">
                  {content.length}/500
                </span>
              </div>
              <div className="relative">
                <textarea
                  id="feedback-content"
                  rows={3}
                  maxLength={500}
                  required
                  placeholder="&gt; Describe what could be refined, fixed, or elevated..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-mono rounded-sm p-3 focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-secondary)]/60 leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Contact / Handle (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div>
                <label htmlFor="feedback-contact" className="block text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5">
                  CONTACT / GITHUB (OPTIONAL):
                </label>
                <input
                  id="feedback-contact"
                  type="text"
                  placeholder="name@email.com or @handle"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full min-h-[38px] bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-mono rounded-sm px-3 py-1.5 focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-secondary)]/60 uppercase"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="w-full sm:w-auto min-h-[38px] px-6 py-2 bg-[var(--text-primary)] text-[var(--bg)] hover:bg-[var(--accent)] hover:text-white border border-[var(--text-primary)] text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'TRANSMITTING...' : '[ TRANSMIT_FEEDBACK ]'}</span>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">
                ERROR: {error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
