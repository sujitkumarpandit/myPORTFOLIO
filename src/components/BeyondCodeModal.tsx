import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { BeyondCodeItem } from '../types';
import { SemanticText } from './SemanticText';
import { BookOpen, Compass, HelpCircle, Sparkles, ExternalLink, X, History, ArrowRight, BookMarked, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function BeyondCodeModal() {
  const isBeyondCodeOpen = useStore(state => state.isBeyondCodeOpen);
  const setBeyondCodeOpen = useStore(state => state.setBeyondCodeOpen);
  const beyondCode = useStore(state => state.beyondCode);
  const projects = useStore(state => state.projects);

  const [selectedBook, setSelectedBook] = useState<BeyondCodeItem | null>(null);
  const [showReadingHistory, setShowReadingHistory] = useState(false);
  const [filterType, setFilterType] = useState<'ALL' | 'BOOK' | 'EXPLORING' | 'CURIOUS' | 'OFFLINE'>('ALL');

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedBook) {
          setSelectedBook(null);
        } else if (isBeyondCodeOpen) {
          setBeyondCodeOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBeyondCodeOpen, selectedBook, setBeyondCodeOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isBeyondCodeOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isBeyondCodeOpen]);

  // Filter only published items
  const publishedItems = useMemo(() => {
    return (beyondCode || []).filter(item => item.published !== false);
  }, [beyondCode]);

  // Books currently being read or active
  const activeBooks = useMemo(() => {
    return publishedItems
      .filter(item => item.type === 'BOOK' && item.status !== 'FINISHED');
  }, [publishedItems]);

  // Finished / historical books
  const historicalBooks = useMemo(() => {
    return publishedItems
      .filter(item => item.type === 'BOOK' && item.status === 'FINISHED');
  }, [publishedItems]);

  // Exploring topics
  const exploringTopics = useMemo(() => {
    return publishedItems.filter(item => item.type === 'EXPLORING');
  }, [publishedItems]);

  // Curious about statements
  const curiosityItems = useMemo(() => {
    return publishedItems.filter(item => item.type === 'CURIOUS_ABOUT');
  }, [publishedItems]);

  // Offline / intellectual interests
  const offlineInterests = useMemo(() => {
    return publishedItems.filter(item => item.type === 'INTEREST');
  }, [publishedItems]);

  return (
    <AnimatePresence>
      {isBeyondCodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setBeyondCodeOpen(false)}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--surface)] border border-[var(--border)] rounded-sm shadow-2xl flex flex-col font-mono z-10 overflow-hidden text-[var(--text-primary)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-primary)]">
                      BEYOND CODE
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 border border-[var(--border)] rounded-xs text-[var(--accent)] font-bold">
                      10% PERSONAL LAYER
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider hidden sm:block">
                    Intellectual curiosity, active reading, and peripheral inquiry.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/now"
                  onClick={() => setBeyondCodeOpen(false)}
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--text-primary)] rounded-xs transition-colors"
                >
                  <span>VIEW ON /NOW</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => setBeyondCodeOpen(false)}
                  className="p-1.5 border border-[var(--border)] hover:border-[var(--text-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xs transition-colors flex items-center gap-1 text-[10px] uppercase font-bold"
                  aria-label="Close Beyond Code dialog"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">ESC</span>
                </button>
              </div>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-[var(--border)] bg-[var(--surface)] overflow-x-auto no-scrollbar shrink-0 text-[10px] font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded-xs border transition-colors ${
                  filterType === 'ALL'
                    ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]'
                    : 'bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)]/40'
                }`}
              >
                ALL SECTIONS ({publishedItems.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterType('BOOK')}
                className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1.5 ${
                  filterType === 'BOOK'
                    ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]'
                    : 'bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)]/40'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                <span>READING ({activeBooks.length + historicalBooks.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterType('EXPLORING')}
                className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1.5 ${
                  filterType === 'EXPLORING'
                    ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]'
                    : 'bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)]/40'
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>TOPICS ({exploringTopics.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterType('CURIOUS')}
                className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1.5 ${
                  filterType === 'CURIOUS'
                    ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]'
                    : 'bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)]/40'
                }`}
              >
                <HelpCircle className="w-3 h-3" />
                <span>CURIOUS ABOUT ({curiosityItems.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterType('OFFLINE')}
                className={`px-2.5 py-1 rounded-xs border transition-colors flex items-center gap-1.5 ${
                  filterType === 'OFFLINE'
                    ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]'
                    : 'bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--text-primary)]/40'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>OFFLINE PURSUITS ({offlineInterests.length})</span>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-5 sm:p-7 overflow-y-auto space-y-8 flex-1">
              
              {/* SECTION 1: READING NOW */}
              {(filterType === 'ALL' || filterType === 'BOOK') && activeBooks.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" />
                      <h3 className="text-xs font-bold tracking-widest uppercase text-[var(--text-primary)]">
                        &gt; READING_NOW
                      </h3>
                    </div>

                    {historicalBooks.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowReadingHistory(!showReadingHistory)}
                        className="text-[9px] font-bold tracking-widest uppercase text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1"
                      >
                        <History className="w-3 h-3" />
                        <span>{showReadingHistory ? 'HIDE ARCHIVE' : `VIEW ARCHIVE (${historicalBooks.length}) →`}</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeBooks.map((book, idx) => {
                      const relatedProject = book.relatedProjectId 
                        ? projects.find(p => p.id === book.relatedProjectId || p.slug === book.relatedProjectId)
                        : null;

                      return (
                        <div
                          key={book.id}
                          onClick={() => setSelectedBook(book)}
                          className="group border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--text-primary)]/40 p-4 rounded-sm flex flex-col justify-between transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs"
                        >
                          <div className="flex gap-4">
                            {book.image ? (
                              <div className="w-16 h-22 sm:w-20 sm:h-28 shrink-0 bg-[var(--surface)] border border-[var(--border)] rounded-xs overflow-hidden shadow-xs relative">
                                <img
                                  src={book.image}
                                  alt={`Cover of ${book.title}`}
                                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                                  loading="lazy"
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-22 sm:w-20 sm:h-28 shrink-0 bg-[var(--surface)] border border-[var(--border)] flex flex-col items-center justify-center p-2 text-center text-[8px] text-[var(--text-secondary)] uppercase">
                                <BookOpen className="w-4 h-4 mb-1 text-[var(--accent)]" />
                                <span>BOOK</span>
                              </div>
                            )}

                            <div className="flex-1 min-w-0 flex flex-col justify-start">
                              <div className="flex items-center justify-between gap-1 text-[8px] tracking-widest uppercase text-[var(--text-secondary)] mb-1">
                                <span>READING / 00{idx + 1}</span>
                                <span className="text-[var(--accent)] font-bold">{book.status || 'READING'}</span>
                              </div>

                              <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                                {book.title}
                              </h4>
                              
                              {book.subtitle && (
                                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">
                                  {book.subtitle}
                                </p>
                              )}

                              {book.topic && (
                                <div className="mt-2 text-[9px] text-[var(--text-secondary)]">
                                  <span className="text-[8px] uppercase tracking-widest opacity-70">TOPIC / </span>
                                  <span className="text-[var(--text-primary)] font-bold">{book.topic}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {book.why && (
                            <div className="mt-3 pt-2.5 border-t border-[var(--border)] text-[11px] text-[var(--text-secondary)] leading-relaxed">
                              <span className="text-[9px] font-bold tracking-widest uppercase text-[var(--text-primary)] block mb-0.5">WHY:</span>
                              <SemanticText text={book.why} />
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-between text-[9px] text-[var(--text-secondary)] uppercase tracking-widest pt-2 border-t border-[var(--border)]/50">
                            {relatedProject ? (
                              <span className="text-[var(--accent)] font-bold flex items-center gap-1">
                                ↳ LINKED TO {relatedProject.title}
                              </span>
                            ) : (
                              <span>DETAILS &amp; ANNOTATION</span>
                            )}
                            
                            <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-[var(--text-primary)] font-bold">
                              [ OPEN ]
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reading History */}
                  {showReadingHistory && historicalBooks.length > 0 && (
                    <div className="mt-4 p-4 border border-dashed border-[var(--border)] bg-[var(--bg)]/50 rounded-sm">
                      <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3 flex items-center justify-between">
                        <span>COMPLETED ARCHIVE</span>
                        <span>{historicalBooks.length} VOLUMES</span>
                      </div>
                      <div className="divide-y divide-[var(--border)]">
                        {historicalBooks.map(book => (
                          <div 
                            key={book.id} 
                            onClick={() => setSelectedBook(book)}
                            className="py-2.5 flex items-center justify-between gap-4 hover:bg-[var(--surface)] px-2 rounded-xs cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-[8px] font-bold px-1 py-0.5 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)] rounded-xs uppercase">
                                FINISHED {book.finishedDate || ''}
                              </span>
                              <div className="truncate">
                                <span className="text-xs font-bold text-[var(--text-primary)]">{book.title}</span>
                                <span className="text-[10px] text-[var(--text-secondary)] ml-2">— {book.subtitle}</span>
                              </div>
                            </div>
                            <span className="text-[9px] text-[var(--text-secondary)] shrink-0 font-bold uppercase hover:text-[var(--accent)]">
                              [ VIEW ]
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 2: TOPICS EXPLORING */}
              {(filterType === 'ALL' || filterType === 'EXPLORING') && exploringTopics.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <h3 className="text-xs font-bold tracking-widest uppercase text-[var(--text-primary)]">
                      &gt; EXPLORING_TOPICS
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 border-l border-[var(--border)]">
                    {exploringTopics.map((item) => {
                      const linkedProject = item.relatedProjectId
                        ? projects.find(p => p.id === item.relatedProjectId || p.slug === item.relatedProjectId)
                        : null;

                      return (
                        <div key={item.id} className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-sm">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-xs font-bold uppercase text-[var(--text-primary)]">
                              {item.title}
                            </h4>
                            {item.topic && (
                              <span className="text-[8px] px-1.5 py-0.5 border border-[var(--border)] rounded-xs text-[var(--text-secondary)] uppercase">
                                {item.topic}
                              </span>
                            )}
                          </div>

                          {(item.note || item.description) && (
                            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mt-1">
                              <SemanticText text={item.note || item.description || ''} />
                            </p>
                          )}

                          {linkedProject && (
                            <div className="mt-2 pt-1.5 border-t border-[var(--border)]/60 text-[9px]">
                              <Link 
                                to={`/work/${linkedProject.slug}`} 
                                onClick={() => setBeyondCodeOpen(false)}
                                className="text-[var(--accent)] hover:underline flex items-center gap-1 font-bold uppercase"
                              >
                                ↳ Related Project: {linkedProject.title}
                              </Link>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION 3: CURIOUS ABOUT */}
              {(filterType === 'ALL' || filterType === 'CURIOUS') && curiosityItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <h3 className="text-xs font-bold tracking-widest uppercase text-[var(--text-primary)]">
                      &gt; CURIOUS_ABOUT
                    </h3>
                  </div>

                  <div className="space-y-2.5 pl-4 border-l border-[var(--border)]">
                    {curiosityItems.map(item => (
                      <div key={item.id} className="p-3 bg-[var(--bg)] border border-[var(--border)] rounded-sm flex items-start gap-3">
                        <span className="text-[var(--accent)] font-mono font-bold text-xs mt-0.5">“</span>
                        <div className="flex-1 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                          <p className="text-[var(--text-primary)] font-medium italic">
                            {item.title}
                          </p>
                          {item.note && (
                            <p className="mt-1 text-[10px] text-[var(--text-secondary)] not-italic">
                              <SemanticText text={item.note} />
                            </p>
                          )}
                        </div>
                        <span className="text-[var(--accent)] font-mono font-bold text-xs mt-0.5">”</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 4: OFFLINE PURSUITS */}
              {(filterType === 'ALL' || filterType === 'OFFLINE') && offlineInterests.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <h3 className="text-xs font-bold tracking-widest uppercase text-[var(--text-primary)]">
                      &gt; OFFLINE_PURSUITS
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 pl-4 border-l border-[var(--border)]">
                    {offlineInterests.map(item => (
                      <div 
                        key={item.id}
                        className="px-3 py-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-sm flex items-center gap-2 text-[10px]"
                      >
                        <span className="font-bold text-[var(--text-primary)] uppercase">{item.title}</span>
                        {item.subtitle && (
                          <span className="text-[8px] text-[var(--text-secondary)] uppercase tracking-wider">
                            · {item.subtitle}
                          </span>
                        )}
                        {item.note && (
                          <span className="text-[9px] text-[var(--text-secondary)] italic">
                            ({item.note})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Footer Strip */}
            <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--bg)]/90 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] text-[var(--text-secondary)] uppercase tracking-wider shrink-0">
              <span>90% SOFTWARE &amp; SYSTEMS · 10% READING &amp; INTELLECTUAL EXPLORATION</span>
              <div className="flex items-center gap-4">
                <Link
                  to="/now"
                  onClick={() => setBeyondCodeOpen(false)}
                  className="text-[var(--accent)] hover:underline font-bold"
                >
                  GOTO /NOW PAGE →
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Book Detail Inspector */}
          {selectedBook && (
            <div 
              className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setSelectedBook(null)}
            >
              <div 
                className="bg-[var(--surface)] border border-[var(--border)] max-w-lg w-full p-6 rounded-sm shadow-2xl relative font-mono animate-in zoom-in-95 duration-150"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-4 pb-4 mb-4 border-b border-[var(--border)]">
                  <div>
                    <span className="text-[9px] font-bold text-[var(--accent)] tracking-widest uppercase block mb-1">
                      INTELLECTUAL CONTEXT / {selectedBook.status || 'READING'}
                    </span>
                    <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight">
                      {selectedBook.title}
                    </h3>
                    {selectedBook.subtitle && (
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        by {selectedBook.subtitle}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedBook(null)}
                    className="p-1 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] rounded-xs"
                    aria-label="Close details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedBook.image && (
                    <div className="w-full h-40 bg-[var(--bg)] border border-[var(--border)] rounded-xs overflow-hidden flex items-center justify-center">
                      <img 
                        src={selectedBook.image} 
                        alt={`Cover of ${selectedBook.title}`} 
                        className="h-full object-contain"
                      />
                    </div>
                  )}

                  {selectedBook.why && (
                    <div>
                      <span className="text-[9px] font-bold tracking-widest uppercase text-[var(--text-primary)] block mb-1">
                        WHY I'M READING THIS:
                      </span>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-3 border-l-2 border-[var(--accent)] bg-[var(--bg)] p-2 rounded-xs">
                        <SemanticText text={selectedBook.why} />
                      </p>
                    </div>
                  )}

                  {selectedBook.note && (
                    <div>
                      <span className="text-[9px] font-bold tracking-widest uppercase text-[var(--text-primary)] block mb-1">
                        ANNOTATION / KEY TAKEAWAY:
                      </span>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        <SemanticText text={selectedBook.note} />
                      </p>
                    </div>
                  )}

                  {selectedBook.topic && (
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="font-bold text-[var(--text-secondary)] uppercase">TOPIC:</span>
                      <span className="px-2 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded-xs font-bold text-[var(--text-primary)]">
                        {selectedBook.topic}
                      </span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-4">
                    {selectedBook.externalUrl ? (
                      <a
                        href={selectedBook.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90 rounded-xs text-[10px] font-bold uppercase tracking-widest transition-opacity"
                      >
                        <span>OPEN EXTERNAL REFERENCE</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wider">
                        PERSONAL STUDY ARCHIVE
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedBook(null)}
                      className="px-3 py-1.5 border border-[var(--border)] hover:border-[var(--text-primary)] text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-widest rounded-xs"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
