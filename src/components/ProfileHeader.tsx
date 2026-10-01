import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { SemanticText } from './SemanticText';
import India from '@react-map/india';

const INDIAN_STATES = [
  "Jammu and Kashmir", "West Bengal", "Uttarakhand", "Uttar Pradesh", "Tripura",
  "Tamil Nadu", "Telangana", "Sikkim", "Rajasthan", "Puducherry", "Punjab",
  "Odisha", "Nagaland", "Mizoram", "Madhya Pradesh", "Manipur", "Meghalaya",
  "Maharashtra", "Lakshadweep", "Kerala", "Karnataka", "Ladakh", "Jharkhand",
  "Haryana", "Himachal Pradesh", "Gujarat", "Goa", "Dadra and Nagar Haveli",
  "Delhi", "Daman and Diu", "Chhattisgarh", "Chandigarh", "Bihar", "Assam",
  "Arunachal Pradesh", "Andhra Pradesh", "Andaman and Nicobar Islands"
];

export function ProfileHeader() {
  const profile = useStore(state => state.profile);

  if (!profile) return null;

  const locationParts = profile.location?.split(',').map(p => p.trim()) || [];
  const stateMatch = INDIAN_STATES.find(state => 
    locationParts.some(part => part.toLowerCase() === state.toLowerCase())
  );

  const cityColors = stateMatch ? { [stateMatch]: 'var(--accent)' } : {};

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-sm overflow-hidden mb-6 md:mb-8 font-mono shadow-sm">
      {/* Profile Banner */}
      <div className="h-28 sm:h-36 md:h-48 bg-[var(--bg)] border-b border-[var(--border)] relative overflow-hidden flex items-center justify-center">
        {profile.bannerImage ? (
          <img src={profile.bannerImage} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: 'center center'
          }}></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] to-transparent opacity-60"></div>
        {/* Decorative elements */}
        <div className="absolute right-3 top-3 sm:right-6 sm:top-6 flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase bg-[var(--surface)]/80 backdrop-blur-xs px-2 py-1 border border-[var(--border)] rounded-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
          [ SYS_ONLINE ]
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end">
            {/* Profile Image */}
            <div className="-mt-10 sm:-mt-14 md:-mt-16 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-sm border-4 border-[var(--surface)] bg-[var(--bg)] overflow-hidden shadow-sm relative shrink-0">
              {profile.profileImage || profile.heroImage ? (
                <img src={profile.profileImage || profile.heroImage} alt="Profile" className="w-full h-full object-cover transition-all duration-500" />
              ) : (
                <div className="w-full h-full bg-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] text-xs tracking-widest uppercase">
                  IMG
                </div>
              )}
            </div>
            
            <div className="pb-1 md:pb-2 mt-1 sm:mt-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] uppercase mb-1 sm:mb-2 leading-tight">{profile.name}</h1>
              <p className="text-[11px] sm:text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">{profile.headline}</p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
            <Link to="/connect" className="h-11 flex-1 md:flex-none md:w-auto px-6 sm:px-8 bg-[var(--text-primary)] text-[var(--bg)] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center whitespace-nowrap">
              [ CONNECT ]
            </Link>
          </div>
        </div>

        {/* Technical Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-4 md:pt-6 border-t border-[var(--border)]">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[var(--text-secondary)] rounded-full"></span> LOCATION
            </span>
            <div className="ml-2.5 flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-wider truncate">{profile.location || 'GLOBAL'}</span>
              <div className="w-6 h-6 shrink-0 opacity-80">
                <India 
                  type="select-single" 
                  size={24} 
                  mapColor="transparent" 
                  strokeColor="var(--text-primary)" 
                  strokeWidth={1.5}
                  cityColors={cityColors}
                  disableHover={true}
                  disableClick={true}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[var(--text-secondary)] rounded-full"></span> FOCUS
            </span>
            <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest ml-2.5 truncate">{profile.role}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[var(--text-secondary)] rounded-full"></span> STATUS
            </span>
            <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest ml-2.5 truncate">{profile.status}</span>
          </div>
          {profile.email && (
            <div className="flex flex-col gap-1">
              <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1 h-1 bg-[var(--text-secondary)] rounded-full"></span> CONTACT
              </span>
              <span className="text-[10px] font-bold text-[var(--text-primary)] uppercase tracking-widest ml-2.5 truncate">{profile.email}</span>
            </div>
          )}
        </div>
        
        {/* Short Bio */}
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-[var(--border)]">
          <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed max-w-4xl border-l-2 border-[var(--border)] pl-3 md:pl-4">
            <SemanticText text={profile.summary} />
          </p>
        </div>
      </div>
    </div>
  );
}
