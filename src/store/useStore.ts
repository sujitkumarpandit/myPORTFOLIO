import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Profile,
  Project,
  ActivityPost,
  Credential,
  TimelineEvent,
  BrandEntity,
  Comment,
  BeyondCodeItem,
} from '../types';
import { defaultEntities } from '../lib/brandRegistry';
import {
  siteProfile,
  projects as defaultProjects,
  feed as defaultFeed,
  credentials as defaultCredentials,
  journey as defaultJourney,
  defaultBeyondCode,
} from '../data';

interface StoreState {
  profile: Profile | null;
  projects: Project[];
  posts: ActivityPost[];
  comments: Comment[];
  credentials: Credential[];
  timeline: TimelineEvent[];
  entities: BrandEntity[];
  beyondCode: BeyondCodeItem[];
  isBeyondCodeOpen: boolean;
  setBeyondCodeOpen: (open: boolean) => void;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  init: () => void;
  refreshAll: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  profile: siteProfile,
  projects: defaultProjects,
  posts: defaultFeed,
  comments: [],
  credentials: defaultCredentials,
  timeline: defaultJourney,
  entities: defaultEntities,
  beyondCode: defaultBeyondCode,
  isBeyondCodeOpen: false,
  setBeyondCodeOpen: (open: boolean) => set({ isBeyondCodeOpen: open }),
  loading: true,
  searchQuery: '',
  setSearchQuery: (q: string) => set({ searchQuery: q }),

  refreshAll: async () => {
    if (!isSupabaseConfigured()) {
      set({ loading: false });
      return;
    }

    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (profileData) {
        set({ profile: profileData as Profile });
      }

      // 2. Fetch Projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('sortOrder', { ascending: true });

      if (projectsData && projectsData.length > 0) {
        set({ projects: projectsData as Project[] });
      }

      // 3. Fetch Posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false });

      if (postsData && postsData.length > 0) {
        set({ posts: postsData as ActivityPost[] });
      }

      // 4. Fetch Credentials
      const { data: credentialsData } = await supabase
        .from('credentials')
        .select('*')
        .order('sortOrder', { ascending: true });

      if (credentialsData && credentialsData.length > 0) {
        set({ credentials: credentialsData as Credential[] });
      }

      // 5. Fetch Timeline
      const { data: timelineData } = await supabase
        .from('timeline')
        .select('*')
        .order('sortOrder', { ascending: true });

      if (timelineData && timelineData.length > 0) {
        set({ timeline: timelineData as TimelineEvent[] });
      }

      // 6. Fetch Beyond Code
      const { data: beyondCodeData } = await supabase
        .from('beyond_code')
        .select('*')
        .order('sortOrder', { ascending: true });

      if (beyondCodeData && beyondCodeData.length > 0) {
        set({ beyondCode: beyondCodeData as BeyondCodeItem[] });
      }

      // 7. Fetch Comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*')
        .order('date', { ascending: true });

      if (commentsData) {
        set({ comments: commentsData as Comment[] });
      }

      // 8. Fetch Entities
      const { data: entitiesData } = await supabase
        .from('entities')
        .select('*');

      if (entitiesData && entitiesData.length > 0) {
        const merged = [...defaultEntities];
        entitiesData.forEach((dbEntity: any) => {
          const idx = merged.findIndex((e) => e.id === dbEntity.id);
          if (idx >= 0) {
            merged[idx] = { ...merged[idx], ...dbEntity };
          } else {
            merged.push(dbEntity as BrandEntity);
          }
        });
        set({ entities: merged });
      }
    } catch (err) {
      console.warn('Supabase fetch error, using defaults:', err);
    } finally {
      set({ loading: false });
    }
  },

  init: () => {
    get().refreshAll();

    if (!isSupabaseConfigured()) return;

    // Realtime subscription across public tables
    try {
      const channel = supabase
        .channel('portfolio-realtime-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'profiles' },
          (payload) => {
            if (payload.new) {
              set({ profile: payload.new as Profile });
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'projects' },
          () => {
            get().refreshAll();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'posts' },
          () => {
            get().refreshAll();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'comments' },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              set((state) => ({
                comments: [...state.comments, payload.new as Comment],
              }));
            } else {
              get().refreshAll();
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'credentials' },
          () => {
            get().refreshAll();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'timeline' },
          () => {
            get().refreshAll();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'beyond_code' },
          () => {
            get().refreshAll();
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'entities' },
          () => {
            get().refreshAll();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.warn('Supabase realtime subscription exception:', err);
    }
  },
}));
