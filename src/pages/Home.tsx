import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { ProfileHeader } from '../components/ProfileHeader';
import { useStore } from '../store/useStore';
import { Heart, Share2, Check, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SemanticText } from '../components/SemanticText';
import { MobileCategoryTabs } from '../components/MobileCategoryTabs';

export function Home() {
  const posts = useStore(state => state.posts);
  const comments = useStore(state => state.comments);
  const refreshAll = useStore(state => state.refreshAll);
  const [selectedType, setSelectedType] = useState('ALL');
  
  // Initialize likedPosts from localStorage
  const [likedPosts, setLikedPosts] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('likedPostIds');
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
    return new Set<string>();
  });

  const [pendingLikes, setPendingLikes] = useState<Set<string>>(new Set());
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Generate a persistent visitor ID for liking
  const visitorId = useMemo(() => {
    let id = localStorage.getItem('visitorId');
    if (!id) {
      id = `visitor_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('visitorId', id);
    }
    return id;
  }, []);

  // Sync likes from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function syncLikesFromDb() {
      if (!isSupabaseConfigured()) return;
      try {
        const { data, error } = await supabase
          .from('likes')
          .select('postId')
          .eq('userId', visitorId);

        if (!error && data && isMounted) {
          const dbLikedPostIds = new Set<string>();
          data.forEach((row: any) => {
            if (row.postId) {
              dbLikedPostIds.add(row.postId);
            }
          });

          setLikedPosts(prev => {
            const merged = new Set([...prev, ...dbLikedPostIds]);
            localStorage.setItem('likedPostIds', JSON.stringify(Array.from(merged)));
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not sync user likes from database:', err);
      }
    }

    syncLikesFromDb();
    return () => {
      isMounted = false;
    };
  }, [visitorId]);

  const postTypes = useMemo(() => {
    const types = new Set<string>(['ALL']);
    posts.forEach(p => {
      if (p.type) types.add(p.type.toUpperCase());
    });
    return Array.from(types);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedType === 'ALL') return posts;
    return posts.filter(p => (p.type || '').toUpperCase() === selectedType);
  }, [posts, selectedType]);

  const handleShare = async (post: any) => {
    const url = `${window.location.origin}/#post-${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Update from Portfolio`,
          text: post.content,
          url,
        });
        return;
      } catch (err) {
        // clipboard fallback
      }
    }
    navigator.clipboard.writeText(url);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };
  
  const handleComment = async (postId: string) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;
    
    try {
      const commentId = Math.random().toString(36).substring(2, 9);
      const newComment = {
        id: commentId,
        postId,
        visitorId,
        content: text.trim(),
        date: new Date().toISOString()
      };

      if (isSupabaseConfigured()) {
        await supabase.from('comments').insert(newComment);
      }

      setCommentText(prev => ({ ...prev, [postId]: '' }));
      setExpandedComments(prev => ({ ...prev, [postId]: true }));
      await refreshAll();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLike = async (postId: string) => {
    if (pendingLikes.has(postId)) return; // Prevent spam/duplicate clicks

    setPendingLikes(prev => new Set(prev).add(postId));

    const isCurrentlyLiked = likedPosts.has(postId);

    // Optimistic UI update
    const updatedSet = new Set(likedPosts);
    if (isCurrentlyLiked) {
      updatedSet.delete(postId);
    } else {
      updatedSet.add(postId);
    }
    setLikedPosts(updatedSet);
    localStorage.setItem('likedPostIds', JSON.stringify(Array.from(updatedSet)));

    try {
      if (isCurrentlyLiked) {
        if (isSupabaseConfigured()) {
          await supabase
            .from('likes')
            .delete()
            .eq('userId', visitorId)
            .eq('postId', postId);

          const post = posts.find(p => p.id === postId);
          if (post) {
            await supabase
              .from('posts')
              .update({ likeCount: Math.max(0, (post.likeCount || 1) - 1) })
              .eq('id', postId);
          }
        }
      } else {
        if (isSupabaseConfigured()) {
          await supabase
            .from('likes')
            .insert({
              id: `${visitorId}_${postId}`,
              userId: visitorId,
              postId,
              created_at: new Date().toISOString()
            });

          const post = posts.find(p => p.id === postId);
          if (post) {
            await supabase
              .from('posts')
              .update({ likeCount: (post.likeCount || 0) + 1 })
              .eq('id', postId);
          }
        }
      }
      await refreshAll();
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert optimistic update on error
      setLikedPosts(likedPosts);
      localStorage.setItem('likedPostIds', JSON.stringify(Array.from(likedPosts)));
    } finally {
      setPendingLikes(prev => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 font-mono">
      {/* Left Column: Profile Nav */}
      <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
        <LeftSidebar />
      </div>

      {/* Center Column: Main Profile */}
      <div className="col-span-1 lg:col-span-7 flex flex-col gap-6 sm:gap-8 min-w-0">
        
        <ProfileHeader />

        {/* LATEST ACTIVITY SECTION */}
        <div>
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--border)]">
            <h3 className="text-xs font-bold text-[var(--text-secondary)] tracking-widest uppercase">
              LATEST ACTIVITY
            </h3>
            <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-wider">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'UPDATE' : 'UPDATES'}
            </span>
          </div>

          {/* Activity Category Filter Tabs */}
          {postTypes.length > 1 && (
            <MobileCategoryTabs
              categories={postTypes}
              selectedCategory={selectedType}
              onSelectCategory={setSelectedType}
              className="mb-4"
            />
          )}

          {/* Feed List */}
          <div className="flex flex-col gap-4">
            {filteredPosts.map((post) => {
              const postComments = comments.filter(c => c.postId === post.id);
              const isCommentsOpen = expandedComments[post.id] !== false;

              return (
                <article 
                  key={post.id} 
                  id={`post-${post.id}`} 
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-sm overflow-hidden shadow-xs hover:border-[var(--text-primary)] transition-colors"
                >
                  <div className="p-3 sm:p-4 border-b border-[var(--border)] flex justify-between items-center bg-[var(--bg)]/50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-[9px] sm:text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase">[{post.type}]</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <time dateTime={post.date} className="text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">
                        {format(new Date(post.date), 'MMM dd, yyyy')}
                      </time>
                      <button
                        onClick={() => handleShare(post)}
                        aria-label="Share update"
                        className="p-1 hover:text-[var(--accent)] text-[var(--text-secondary)] transition-colors"
                      >
                        {copiedPostId === post.id ? <Check className="w-3.5 h-3.5 text-[var(--accent)]" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6">
                    <p className="text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                      <SemanticText text={post.content} />
                    </p>
                    
                    {post.mediaUrl && post.mediaType === 'IMAGE' && (
                      <div className="rounded-sm overflow-hidden border border-[var(--border)] mb-4 sm:mb-6 bg-[var(--bg)]">
                        <img src={post.mediaUrl} alt="Post attachment" className="w-full h-auto max-h-96 object-cover transition-all duration-300" />
                      </div>
                    )}

                    {(post.tags || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2">
                        <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mr-1 mt-1">TAGS:</span>
                        {post.tags.map(tag => (
                          <span key={tag} className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 bg-[var(--bg)] border border-[var(--border)] rounded-sm text-[var(--text-secondary)] uppercase">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[var(--border)] flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <button 
                          type="button"
                          disabled={pendingLikes.has(post.id)}
                          onClick={() => toggleLike(post.id)} 
                          aria-label={likedPosts.has(post.id) ? 'Unlike update' : 'Like update'}
                          className={`min-h-[38px] flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-all active:scale-95 cursor-pointer disabled:opacity-60 ${likedPosts.has(post.id) ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                        >
                          <Heart size={15} className={`transition-transform duration-200 ${likedPosts.has(post.id) ? 'fill-current scale-110 text-[var(--accent)]' : ''}`} /> 
                          <span>{post.likeCount || 0} {post.likeCount === 1 ? 'LIKE' : 'LIKES'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !isCommentsOpen }))}
                          className="min-h-[38px] flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                        >
                          <MessageSquare size={13} />
                          <span>{postComments.length} {postComments.length === 1 ? 'REPLY' : 'REPLIES'}</span>
                        </button>
                      </div>

                      {post.relatedProjectId && (
                        <Link to={`/work/${post.relatedProjectId}`} className="text-[10px] font-bold text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 uppercase tracking-widest">
                          &gt; VIEW_PROJECT
                        </Link>
                      )}
                    </div>

                    {/* Comments Thread */}
                    {isCommentsOpen && (
                      <div className="pt-4 mt-3 border-t border-[var(--border)] animate-in fade-in duration-150">
                        {postComments.length > 0 && (
                          <div className="flex flex-col gap-2.5 mb-3.5">
                            {postComments.map(comment => (
                              <div key={comment.id} className="bg-[var(--bg)] border border-[var(--border)] rounded-sm p-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[9px] sm:text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase">GUEST_{comment.visitorId.substring(8, 12)}</span>
                                  <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">{format(new Date(comment.date), 'MMM dd')}</span>
                                </div>
                                <p className="text-xs text-[var(--text-primary)] leading-relaxed"><SemanticText text={comment.content} /></p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="WRITE A REPLY..." 
                            className="flex-1 min-h-[40px] bg-[var(--bg)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-bold tracking-wider rounded-sm px-3 py-2 focus:outline-none focus:border-[var(--accent)] transition-colors placeholder:text-[var(--text-secondary)] uppercase"
                            value={commentText[post.id] || ''}
                            onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleComment(post.id);
                              }
                            }}
                          />
                          <button 
                            onClick={() => handleComment(post.id)}
                            disabled={!(commentText[post.id] || '').trim()}
                            className="min-h-[40px] px-4 py-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-95 transition-all disabled:opacity-50 shrink-0"
                          >
                            REPLY
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </article>
              );
            })}

            {filteredPosts.length === 0 && (
              <div className="p-8 text-center bg-[var(--surface)] border border-[var(--border)] rounded-sm text-xs text-[var(--text-secondary)] uppercase tracking-widest">
                No activity updates matching "{selectedType}".
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Widgets */}
      <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
        <RightSidebar />
      </div>
    </div>
  );
}
