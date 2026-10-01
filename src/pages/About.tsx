import { LeftSidebar } from '../components/LeftSidebar';
import { RightSidebar } from '../components/RightSidebar';
import { useStore } from '../store/useStore';
import { SemanticText } from '../components/SemanticText';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function About() {
  const profile = useStore(state => state.profile);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.hash]);

  if (!profile) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-mono">
      <div className="hidden lg:block lg:col-span-2 xl:col-span-2">
        <LeftSidebar />
      </div>

      <div className="col-span-1 lg:col-span-7 flex flex-col gap-8 min-w-0">
        <div className="mb-4 pb-4 border-b border-[var(--border)]">
          <h1 className="font-bold text-3xl mb-2 tracking-tighter uppercase">ABOUT</h1>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">Professional summary and working style.</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-8">
          <div className="w-24 h-24 bg-[var(--bg)] border border-[var(--border)] mb-6 rounded-sm overflow-hidden flex-shrink-0">
            {profile.profileImage || profile.heroImage ? (
              <img src={profile.profileImage || profile.heroImage} alt="Profile" className="w-full h-full object-cover transition-all duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                IMG
              </div>
            )}
          </div>
          <h2 className="font-bold text-3xl mb-6 uppercase tracking-tight">{profile.name}</h2>
          <div className="space-y-6">
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              <SemanticText text={profile.summary} />
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
              <SemanticText text="My working style is defined by deep technical iteration paired with rigorous product design. I do not believe in separating engineering from UX. The architecture must serve the interface, and the interface must leverage the full capability of the architecture." />
            </p>
          </div>
        </div>

        {profile.skills && profile.skills.length > 0 && (
          <div id="skills">
            <h3 className="text-[10px] font-bold text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 tracking-widest uppercase mb-6">SKILLS</h3>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm p-6">
              <ul className="flex flex-wrap gap-3">
                {profile.skills.map((skill, i) => {
                  const colors = [
                    'text-blue-950 bg-blue-400 border-blue-300 shadow-[0_0_15px_rgba(96,165,250,0.6)]',
                    'text-emerald-950 bg-emerald-400 border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.6)]',
                    'text-violet-950 bg-violet-400 border-violet-300 shadow-[0_0_15px_rgba(167,139,250,0.6)]',
                    'text-amber-950 bg-amber-400 border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.6)]',
                    'text-pink-950 bg-pink-400 border-pink-300 shadow-[0_0_15px_rgba(244,114,182,0.6)]',
                    'text-cyan-950 bg-cyan-400 border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.6)]'
                  ];
                  const color = colors[i % colors.length];
                  return (
                    <li key={i} className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm border ${color}`}>
                      {skill}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {profile.experience && profile.experience.length > 0 && (
          <div id="experience" className="mt-8">
            <h3 className="text-[10px] font-bold text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 tracking-widest uppercase mb-6">EXPERIENCE</h3>
            <div className="space-y-6">
              {profile.experience.map((exp, i) => {
                const borderColors = [
                  'border-l-blue-400 shadow-[-4px_0_15px_-5px_rgba(96,165,250,0.6)]', 
                  'border-l-emerald-400 shadow-[-4px_0_15px_-5px_rgba(52,211,153,0.6)]', 
                  'border-l-violet-400 shadow-[-4px_0_15px_-5px_rgba(167,139,250,0.6)]', 
                  'border-l-amber-400 shadow-[-4px_0_15px_-5px_rgba(251,191,36,0.6)]', 
                  'border-l-pink-400 shadow-[-4px_0_15px_-5px_rgba(244,114,182,0.6)]'
                ];
                const textColors = ['text-blue-400', 'text-emerald-400', 'text-violet-400', 'text-amber-400', 'text-pink-400'];
                const borderColor = borderColors[i % borderColors.length];
                const textColor = textColors[i % textColors.length];
                return (
                  <div key={i} className={`bg-[var(--surface)] border border-[var(--border)] border-l-4 ${borderColor} rounded-sm p-6 flex gap-4 md:gap-6 flex-col md:flex-row transition-all duration-300 hover:shadow-lg`}>
                    {exp.logo && (
                      <div className="w-16 h-16 shrink-0 rounded-sm overflow-hidden border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center p-2">
                        <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                        <h4 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-widest">{exp.role} <span className={`${textColor}`}>@ {exp.company}</span></h4>
                        <span className={`text-[10px] font-bold ${textColor} uppercase tracking-widest bg-[var(--bg)] px-2 py-1 rounded-sm border border-[var(--border)]`}>{exp.period}</span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed border-l-2 border-[var(--border)] pl-4">
                        <SemanticText text={exp.description} />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {profile.qualifications && profile.qualifications.length > 0 && (
          <div id="qualifications" className="mt-8">
            <h3 className="text-[10px] font-bold text-[var(--text-secondary)] border-b border-[var(--border)] pb-2 tracking-widest uppercase mb-6">QUALIFICATIONS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.qualifications.map((qual, i) => {
                const borderColors = [
                  'border-t-blue-400 shadow-[0_-4px_15px_-5px_rgba(96,165,250,0.6)]', 
                  'border-t-emerald-400 shadow-[0_-4px_15px_-5px_rgba(52,211,153,0.6)]', 
                  'border-t-violet-400 shadow-[0_-4px_15px_-5px_rgba(167,139,250,0.6)]', 
                  'border-t-amber-400 shadow-[0_-4px_15px_-5px_rgba(251,191,36,0.6)]', 
                  'border-t-pink-400 shadow-[0_-4px_15px_-5px_rgba(244,114,182,0.6)]'
                ];
                const textColors = ['text-blue-400', 'text-emerald-400', 'text-violet-400', 'text-amber-400', 'text-pink-400'];
                const borderColor = borderColors[i % borderColors.length];
                const textColor = textColors[i % textColors.length];
                return (
                  <div key={i} className={`bg-[var(--surface)] border border-[var(--border)] border-t-4 ${borderColor} rounded-sm p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg`}>
                    <div className="flex gap-4 items-start mb-4">
                      {qual.logo && (
                        <div className="w-12 h-12 shrink-0 rounded-sm overflow-hidden border border-[var(--border)] bg-[var(--bg)] flex items-center justify-center p-1">
                          <img src={qual.logo} alt={qual.institution} className="w-full h-full object-contain" />
                        </div>
                      )}
                      <div>
                        <h4 className={`text-sm font-bold uppercase tracking-widest mb-1 ${textColor}`}>{qual.degree}</h4>
                        <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest">{qual.institution}</p>
                      </div>
                    </div>
                    <div className={`text-[10px] font-bold ${textColor} bg-[var(--bg)] w-fit px-2 py-1 rounded-sm border border-[var(--border)] uppercase tracking-widest`}>
                      {qual.year}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
        <RightSidebar />
      </div>
    </div>
  );
}
