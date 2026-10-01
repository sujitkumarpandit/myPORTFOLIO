import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { SemanticTerm } from './SemanticTerm';
import { Feedback } from './Feedback';
import { Activity, Flame, Calendar, Sparkles, ArrowUp } from 'lucide-react';

export function Footer() {
  const profile = useStore(state => state.profile);
  const projects = useStore(state => state.projects) || [];
  const posts = useStore(state => state.posts) || [];
  const credentials = useStore(state => state.credentials) || [];
  const timeline = useStore(state => state.timeline) || [];
  
  const [hoveredDay, setHoveredDay] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  
  const currentYear = new Date().getFullYear();

  // --- Activity Matrix Data Aggregation ---
  const { columns, totalContributions, activeDays, maxScore, monthMarkers } = useMemo(() => {
    const activitiesByDate: Record<string, { score: number, items: any[] }> = {};
    let totalItems = 0;

    // 1. Aggregate projects
    projects.forEach(project => {
      // Map project to specific date or middle of its year
      const dateStr = (project as any).date 
        ? (project as any).date.substring(0, 10) 
        : project.year && project.year.length === 4 
          ? `${project.year}-06-15` 
          : `${currentYear}-01-15`;
      
      if (!activitiesByDate[dateStr]) activitiesByDate[dateStr] = { score: 0, items: [] };
      activitiesByDate[dateStr].score += 4;
      activitiesByDate[dateStr].items.push({ 
        category: 'PROJECT', 
        type: 'PROJECT', 
        weight: 4, 
        title: project.title,
        detail: project.shortDescription || project.category 
      });
      totalItems += 1;
    });

    // 2. Aggregate posts
    posts.forEach(post => {
      if (!post.date) return;
      const dateStr = post.date.substring(0, 10);
      if (!activitiesByDate[dateStr]) activitiesByDate[dateStr] = { score: 0, items: [] };
      
      let weight = 1;
      let category = 'POST';
      if (post.type === 'PROJECT_UPDATE') { weight = 3; category = 'PROJECT'; }
      else if (post.type === 'MILESTONE') { weight = 4; category = 'MILESTONE'; }
      else if (post.type === 'ACHIEVEMENT') { weight = 4; category = 'ACHIEVEMENT'; }
      else if (post.type === 'LEARNING') { weight = 2; category = 'LEARNING'; }
      else if (post.type === 'BUILD_UPDATE') { weight = 2; category = 'BUILD'; }
      else if (post.type === 'IMAGE' || post.type === 'VIDEO') { weight = 1; category = 'MEDIA'; }
      
      activitiesByDate[dateStr].score += weight;
      activitiesByDate[dateStr].items.push({ 
        category, 
        type: post.type || 'TEXT', 
        weight, 
        title: post.content ? (post.content.length > 60 ? `${post.content.substring(0, 60)}...` : post.content) : 'Activity Update' 
      });
      totalItems += 1;
    });

    // 3. Aggregate credentials
    credentials.forEach(cred => {
      if (!cred.date) return;
      const dateStr = cred.date.length === 4 ? `${cred.date}-04-01` : cred.date.substring(0, 10);
      if (!activitiesByDate[dateStr]) activitiesByDate[dateStr] = { score: 0, items: [] };
      activitiesByDate[dateStr].score += 3;
      activitiesByDate[dateStr].items.push({ 
        category: 'CREDENTIAL', 
        type: 'CREDENTIAL', 
        weight: 3, 
        title: cred.title,
        detail: cred.issuer 
      });
      totalItems += 1;
    });

    // 4. Aggregate timeline events
    timeline.forEach(event => {
      if (!event.year) return;
      const dateStr = `${event.year}-09-01`;
      if (!activitiesByDate[dateStr]) activitiesByDate[dateStr] = { score: 0, items: [] };
      activitiesByDate[dateStr].score += 3;
      activitiesByDate[dateStr].items.push({
        category: 'JOURNEY',
        type: 'TIMELINE',
        weight: 3,
        title: event.title,
        detail: event.category
      });
      totalItems += 1;
    });
    
    // Build matrix for 52 weeks (last 364 days) starting on a Sunday
    const cols = [];
    let currentColumn: any[] = [];
    
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (52 * 7));
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay); // Shift to Sunday
    
    const iterDate = new Date(startDate);
    let activeDaysCount = 0;
    let highestDailyScore = 0;
    const monthsMap: { index: number; label: string }[] = [];
    let lastMonth = -1;

    let colIndex = 0;
    while (iterDate <= today || iterDate.getDay() !== 0) {
      if (iterDate > today && iterDate.getDay() === 0) break;
      
      const localYear = iterDate.getFullYear();
      const localMonth = String(iterDate.getMonth() + 1).padStart(2, '0');
      const localDay = String(iterDate.getDate()).padStart(2, '0');
      const dStr = `${localYear}-${localMonth}-${localDay}`;
      
      const activity = activitiesByDate[dStr];
      const score = activity ? activity.score : 0;
      if (score > 0 && iterDate <= today) {
        activeDaysCount += 1;
        if (score > highestDailyScore) highestDailyScore = score;
      }

      // Check for month label change on the first day of each column
      if (currentColumn.length === 0) {
        const monthNum = iterDate.getMonth();
        if (monthNum !== lastMonth) {
          const monthShort = iterDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
          monthsMap.push({ index: colIndex, label: monthShort });
          lastMonth = monthNum;
        }
      }
      
      currentColumn.push({
        date: new Date(iterDate),
        dateStr: dStr,
        score,
        items: activity ? activity.items : [],
        isFuture: iterDate > today
      });
      
      if (currentColumn.length === 7) {
        cols.push(currentColumn);
        currentColumn = [];
        colIndex++;
      }
      
      iterDate.setDate(iterDate.getDate() + 1);
    }
    
    if (currentColumn.length > 0) cols.push(currentColumn);
    
    return {
      columns: cols,
      totalContributions: totalItems,
      activeDays: activeDaysCount,
      maxScore: highestDailyScore,
      monthMarkers: monthsMap
    };
  }, [projects, posts, credentials, timeline, currentYear]);

  if (!profile) return null;

  // Helper for GitHub-inspired cell colors based on activity intensity
  const getCellColor = (score: number) => {
    if (score === 0) return { bg: 'transparent', border: 'var(--border)' };
    if (score <= 2) return { bg: 'rgba(255, 77, 0, 0.25)', border: 'transparent' };
    if (score <= 5) return { bg: 'rgba(255, 77, 0, 0.55)', border: 'transparent' };
    if (score <= 8) return { bg: 'rgba(255, 77, 0, 0.8)', border: 'transparent' };
    return { bg: 'rgba(255, 77, 0, 1)', border: 'transparent', shadow: '0 0 8px rgba(255, 77, 0, 0.6)' };
  };

  return (
    <footer className="mt-16 md:mt-24 border-t border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] font-mono relative">
      
      {/* Subtle Technical Grid Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: 'center center'
      }}></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-8 sm:pt-10 pb-28 lg:pb-8 relative z-10 flex flex-col gap-8 sm:gap-10">
        
        {/* Layer 1: Professional Activity Matrix */}
        <section aria-labelledby="activity-matrix-heading" className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <h2 id="activity-matrix-heading" className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
                PROFESSIONAL ACTIVITY MATRIX
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              <span>52 WEEKS</span>
              <span>·</span>
              <span className="text-[var(--accent)]">{totalContributions} AGGREGATED SIGNALS</span>
              <span>·</span>
              <span>{activeDays} ACTIVE DAYS</span>
            </div>
          </div>

          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-sm p-3 sm:p-5 flex flex-col items-center max-w-full overflow-hidden">
            
            {/* Scrollable Matrix Container */}
            <div 
              className="w-full overflow-x-auto pb-3 pt-1 hide-scrollbar flex justify-start lg:justify-center touch-pan-x"
              onMouseMove={(e) => setHoverPos({ x: e.clientX, y: e.clientY })}
            >
              <div className="flex flex-col gap-1.5" onMouseLeave={() => setHoveredDay(null)}>
                
                {/* Month Indicators Header */}
                <div className="flex gap-1 md:gap-[5px] pl-6 text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-widest h-4 select-none">
                  {columns.map((_, colIdx) => {
                    const marker = monthMarkers.find(m => m.index === colIdx);
                    return (
                      <div key={colIdx} className="w-3 md:w-3 text-left overflow-visible whitespace-nowrap">
                        {marker ? marker.label : ''}
                      </div>
                    );
                  })}
                </div>

                {/* Heatmap Grid with Day Labels */}
                <div className="flex gap-2 items-center">
                  {/* Day of Week Labels */}
                  <div className="flex flex-col gap-1 md:gap-[5px] text-[7px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter w-4 select-none">
                    <span className="h-3 leading-3 opacity-0">S</span>
                    <span className="h-3 leading-3">M</span>
                    <span className="h-3 leading-3 opacity-0">T</span>
                    <span className="h-3 leading-3">W</span>
                    <span className="h-3 leading-3 opacity-0">T</span>
                    <span className="h-3 leading-3">F</span>
                    <span className="h-3 leading-3 opacity-0">S</span>
                  </div>

                  {/* Grid Columns */}
                  <div className="flex gap-1 md:gap-[5px]">
                    {columns.map((col, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-1 md:gap-[5px]">
                        {col.map((day, dayIdx) => {
                          const color = getCellColor(day.score);
                          const isToday = !day.isFuture && new Date().toDateString() === day.date.toDateString();
                          const isSelected = selectedDay?.dateStr === day.dateStr;
                          
                          return (
                            <button 
                              key={dayIdx}
                              type="button"
                              aria-label={`Activity for ${day.dateStr}: score ${day.score}`}
                              onClick={() => setSelectedDay(isSelected ? null : day)}
                              className={`w-3 h-3 rounded-[2px] transition-all duration-150 ${
                                day.isFuture 
                                  ? 'opacity-0 pointer-events-none' 
                                  : 'cursor-pointer hover:scale-135 active:scale-95 hover:z-20 relative tap-highlight-transparent'
                              }`}
                              style={{
                                backgroundColor: color.bg,
                                border: `1px solid ${(isToday || isSelected) ? '#ff4d00' : color.border}`,
                                boxShadow: isSelected ? '0 0 8px #ff4d00' : color.shadow,
                                outline: isToday && day.score > 0 ? '1px solid #ff4d00' : 'none',
                                outlineOffset: '1px'
                              }}
                              onMouseEnter={() => setHoveredDay(day)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            
            {/* Heatmap Legend */}
            <div className="w-full flex flex-wrap justify-between items-center gap-3 text-[8px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mt-3 pt-3 border-t border-[var(--border)]">
              <span className="text-[9px]">AGGREGATES: PROJECTS + POSTS + CREDENTIALS + TIMELINE</span>
              
              <div className="flex items-center gap-2">
                <span>LESS</span>
                <div className="flex gap-[3px]">
                  <div className="w-2.5 h-2.5 rounded-[2px] border border-[var(--border)] bg-transparent" title="0 activity"></div>
                  <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: 'rgba(255, 77, 0, 0.25)' }} title="1-2 activity"></div>
                  <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: 'rgba(255, 77, 0, 0.55)' }} title="3-5 activity"></div>
                  <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: 'rgba(255, 77, 0, 0.8)' }} title="6-8 activity"></div>
                  <div className="w-2.5 h-2.5 rounded-[2px]" style={{ backgroundColor: 'rgba(255, 77, 0, 1)' }} title="9+ activity"></div>
                </div>
                <span>MORE</span>
              </div>
            </div>

            {/* Selected Day Touch/Click Detail Panel */}
            {selectedDay && !selectedDay.isFuture && (
              <div className="w-full mt-4 p-4 bg-[var(--surface)] border border-[var(--accent)] rounded-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                    <span className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase">
                      {selectedDay.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedDay(null)}
                    className="text-[9px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase px-2 py-0.5 border border-[var(--border)] rounded-sm"
                  >
                    [ CLOSE ✕ ]
                  </button>
                </div>

                {selectedDay.score > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-[var(--text-primary)]">
                      <span>AGGREGATED ACTIVITY SCORE:</span>
                      <span className="text-[var(--accent)]">+{selectedDay.score}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {selectedDay.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-start justify-between gap-2 text-[10px] bg-[var(--bg)] p-2.5 rounded-sm border border-[var(--border)]">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="font-bold text-[var(--accent)] text-[9px]">[{item.category}]</span>
                              <span className="text-[8px] text-[var(--text-secondary)] font-bold">+{item.weight} PTS</span>
                            </div>
                            <p className="text-[var(--text-primary)] font-bold truncate">{item.title}</p>
                            {item.detail && <p className="text-[9px] text-[var(--text-secondary)] truncate">{item.detail}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider py-1">
                    No logged contributions recorded on this date.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* HTML Tooltip Overlay on Desktop Hover */}
        {hoveredDay && !hoveredDay.isFuture && (
          <div 
            className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-[calc(100%+16px)]"
            style={{ left: hoverPos.x, top: hoverPos.y }}
          >
            <div className="bg-[var(--bg)] border border-[var(--border)] p-3 rounded-sm shadow-2xl min-w-[180px] relative">
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--bg)] border-b border-r border-[var(--border)] transform rotate-45"></div>
              
              <p className="text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase mb-1">
                {hoveredDay.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              
              {hoveredDay.score > 0 ? (
                <>
                  <p className="text-[10px] font-bold text-[#ff4d00] mb-2">{hoveredDay.score} ACTIVITY SCORE</p>
                  <div className="flex flex-col gap-1 mt-2">
                    {Object.entries(hoveredDay.items.reduce((acc: any, item: any) => {
                      if (!acc[item.category]) acc[item.category] = { count: 0, weight: 0 };
                      acc[item.category].count += 1;
                      acc[item.category].weight += item.weight;
                      return acc;
                    }, {})).map(([cat, data]: any) => (
                      <div key={cat} className="flex justify-between items-center text-[9px] uppercase tracking-widest text-[var(--text-primary)]">
                        <span className="opacity-70 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                          {cat} ({data.count})
                        </span>
                        <span className="font-bold text-[var(--accent)]">+{data.weight}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-[9px] font-bold text-[var(--text-primary)] opacity-50 uppercase tracking-widest">No Activity</p>
              )}
            </div>
          </div>
        )}

        {/* Layer 2: Compact Feedback Component */}
        <section aria-labelledby="feedback-section-heading">
          <Feedback />
        </section>

        {/* Layer 3: Social Links, Brand & Signature */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-6 border-t border-[var(--border)]">
          
          {/* Social Brand Links & Quick Return */}
          <div className="flex flex-wrap items-center gap-4 text-[10px]">
            {profile.social?.github && <SemanticTerm term="GitHub" mode="link" href={profile.social.github} />}
            {profile.social?.linkedin && <SemanticTerm term="LinkedIn" mode="link" href={profile.social.linkedin} />}
            {profile.whatsapp && <SemanticTerm term="WhatsApp" mode="link" href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`} />}
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                EMAIL
              </a>
            )}
          </div>

          {/* Signature */}
          <div className="flex flex-col items-start md:items-end w-full md:w-auto">
            <h2 className="text-xl font-bold uppercase tracking-tighter text-[var(--text-primary)] leading-none">STILL BUILDING.</h2>
            <div className="flex items-center gap-3 mt-1.5 text-[8px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
              <span>{profile.name}</span>
              <span>·</span>
              <span>© {currentYear}</span>
            </div>
          </div>
        </div>

      </div>
      
      {/* Hide scrollbar utility */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </footer>
  );
}
