/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  addDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Character, Quest, BacStream, Origin, StudySession, ORIGIN_DATA } from '../types';
import { THEMES, ThemeDefinition } from '../lib/themes';

export interface UserProfile {
  uid: string;
  username: string;
  email: string;
  onboarded: boolean;
  selectedStream?: BacStream;
  theme?: string;
  language?: 'en' | 'ar';
}

export interface PlannerBlock {
  id: string;
  title: string;
  subject: string;
  startTime: string; // ISO
  endTime: string; // ISO
  type: 'study' | 'break' | 'review';
}

export interface Guild {
  id: string;
  name: string;
  type: 'Study Circle' | 'Class Squad' | 'Subject Masters' | 'Speedrunners' | 'Night Owls';
  level: number;
  xp: number;
  members: string[];
}

export interface Friend {
  id: string;
  name: string;
  level: number;
  lastActive: string;
  status: 'online' | 'offline' | 'studying';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0-100
  secret?: boolean;
}

export interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  showMilliseconds: boolean;
  soundEnabled: boolean;
  tickSound: string;
  volume: number;
}

interface AppState {
  // Auth & Onboarding
  user: FirebaseUser | null;
  profile: UserProfile | null;
  userEmail: string | null;
  selectedStream: BacStream | null;
  onboarded: boolean;
  
  // Character
  character: Character | null;
  streak: {
    current: number;
    best: number;
    lastActive: string;
  };
  
  // Quests & Progress
  quests: Quest[];
  sessions: StudySession[];
  achievements: Achievement[];
  
  // Planner
  plannerBlocks: PlannerBlock[];
  
  // Social
  guild: Guild | null;
  friends: Friend[];
  
  // Theme
  themeId: string;
  theme: ThemeDefinition;
  language: 'en' | 'ar';

  // Timer Settings
  timerSettings: TimerSettings;
  
  // Actions
  setUser: (user: FirebaseUser | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  logout: () => void;
  setStream: (stream: BacStream) => void;
  completeOnboarding: (name: string, origin: Origin) => void;
  addQuest: (quest: Omit<Quest, 'id' | 'completed'>) => void;
  toggleQuest: (id: string) => void;
  addSession: (session: Omit<StudySession, 'id' | 'timestamp'>) => void;
  setTheme: (themeId: string) => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  gainXp: (amount: number) => void;
  updateTimerSettings: (settings: Partial<TimerSettings>) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  
  // Planner Actions
  addPlannerBlock: (block: Omit<PlannerBlock, 'id'>) => void;
  removePlannerBlock: (id: string) => void;
  setPlannerBlocks: (blocks: PlannerBlock[]) => void;
  setQuests: (quests: Quest[]) => void;
  
  // Social Actions
  joinGuild: (guild: Guild) => void;
  addFriend: (friend: Friend) => void;
  setFriends: (friends: Friend[]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      userEmail: null,
      selectedStream: null,
      onboarded: false,
      character: null,
      streak: { current: 0, best: 0, lastActive: new Date().toISOString() },
      quests: [],
      sessions: [],
      achievements: [
        { id: '1', title: 'First Steps', description: 'Complete your first study session', icon: 'Footprints', progress: 0 },
        { id: '2', title: 'Focus Master', description: 'Complete 10 pomodoro sessions', icon: 'Target', progress: 0 },
        { id: '3', title: 'Night Owl', description: 'Study after midnight', icon: 'Moon', progress: 0, secret: true },
      ],
      plannerBlocks: [],
      guild: null,
      friends: [],
      themeId: 'aurora',
      theme: THEMES['Aurora Borealis'],
      language: 'en',
      timerSettings: {
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        showMilliseconds: false,
        soundEnabled: true,
        tickSound: 'None',
        volume: 50
      },

      setUser: (user) => set({ user, userEmail: user?.email || null }),
      setProfile: (profile) => {
        const themeName = profile?.theme || 'Aurora Borealis';
        const theme = THEMES[themeName] || THEMES['Aurora Borealis'];
        set({ 
          profile, 
          onboarded: profile?.onboarded || false,
          selectedStream: profile?.selectedStream || null,
          themeId: theme.id,
          theme,
          language: profile?.language || 'en'
        });
      },
      logout: () => set({ 
        user: null, 
        profile: null, 
        userEmail: null, 
        onboarded: false,
        character: null,
        quests: [],
        plannerBlocks: []
      }),
      
      setStream: (stream) => set({ selectedStream: stream }),
      
      completeOnboarding: async (name: string, origin: Origin) => {
        const state = useStore.getState();
        const character = {
          name,
          origin,
          level: 0,
          xp: 0,
          maxXp: 100,
          gold: 0,
          stats: { intelligence: 0, stamina: 0, focus: 0 },
          equipment: {},
          avatarUrl: ORIGIN_DATA[origin].imageUrl
        };

        if (state.user) {
          try {
            const userDocRef = doc(db, 'users', state.user.uid);
            const profileDocRef = doc(db, 'profiles', state.user.uid);
            
            const updateData = {
              onboarded: true,
              character,
              selectedStream: state.selectedStream
            };

            const publicProfileData = {
              uid: state.user.uid,
              username: state.profile?.username || name,
              level: 0,
              avatarUrl: character.avatarUrl,
              status: 'online'
            };

            await updateDoc(userDocRef, updateData);
            await setDoc(profileDocRef, publicProfileData);
          } catch (error) {
            console.error('Onboarding sync error:', error);
          }
        }

        set((state) => ({
          onboarded: true,
          character
        }));
      },

      addQuest: async (quest) => {
        const state = useStore.getState();
        const id = Math.random().toString(36).substr(2, 9);
        const newQuest = { ...quest, id, completed: false };

        if (state.user) {
          try {
            const path = `users/${state.user.uid}/quests`;
            await setDoc(doc(db, path, id), newQuest);
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, `users/${state.user.uid}/quests/${id}`);
          }
        }

        set((state) => ({
          quests: [...state.quests, newQuest]
        }));
      },

      toggleQuest: async (id) => {
        const state = useStore.getState();
        const quest = state.quests.find(q => q.id === id);
        if (!quest) return;
        
        const newCompleted = !quest.completed;

        if (state.user) {
          try {
            const path = `users/${state.user.uid}/quests/${id}`;
            await updateDoc(doc(db, path), { completed: newCompleted });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `users/${state.user.uid}/quests/${id}`);
          }
        }

        set((state) => ({
          quests: state.quests.map(q => q.id === id ? { ...q, completed: newCompleted } : q)
        }));
      },

      addSession: (session) => set((state) => {
        const now = new Date();
        const lastActive = new Date(state.streak.lastActive);
        const diffDays = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        
        let newStreak = state.streak.current;
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        } else if (newStreak === 0) {
          newStreak = 1;
        }

        return {
          sessions: [
            ...state.sessions, 
            { ...session, id: Math.random().toString(36).substr(2, 9), timestamp: now.toISOString() }
          ],
          streak: {
            current: newStreak,
            best: Math.max(newStreak, state.streak.best),
            lastActive: now.toISOString()
          }
        };
      }),

      setTheme: async (themeIdOrName) => {
        const theme = Object.values(THEMES).find(t => t.id === themeIdOrName || t.name === themeIdOrName) || THEMES['Aurora Borealis'];
        const state = useStore.getState();
        
        if (state.user) {
          try {
            const userDocRef = doc(db, 'users', state.user.uid);
            await updateDoc(userDocRef, { theme: theme.name });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `users/${state.user.uid}`);
          }
        }
        
        set({ themeId: theme.id, theme });
      },

      setLanguage: async (language) => {
        const state = useStore.getState();
        
        if (state.user) {
          try {
            const userDocRef = doc(db, 'users', state.user.uid);
            await updateDoc(userDocRef, { language });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `users/${state.user.uid}`);
          }
        }
        
        set({ language });
      },

      gainXp: (amount) => set((state) => {
        if (!state.character) return state;
        
        let newXp = state.character.xp + amount;
        let newLevel = state.character.level;
        let newMaxXp = state.character.maxXp;

        while (newXp >= newMaxXp) {
          newXp -= newMaxXp;
          newLevel += 1;
          newMaxXp = Math.floor(newMaxXp * 1.2);
        }

        return {
          character: {
            ...state.character,
            xp: newXp,
            level: newLevel,
            maxXp: newMaxXp
          }
        };
      }),

      updateTimerSettings: (settings) => set((state) => ({
        timerSettings: { ...state.timerSettings, ...settings }
      })),
      
      updateCharacter: (updates) => set((state) => ({
        character: state.character ? { ...state.character, ...updates } : null
      })),

      addPlannerBlock: async (block) => {
        const state = useStore.getState();
        const id = Math.random().toString(36).substr(2, 9);
        const newBlock = { ...block, id };

        if (state.user) {
          try {
            const path = `users/${state.user.uid}/planner`;
            await setDoc(doc(db, path, id), newBlock);
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, `users/${state.user.uid}/planner/${id}`);
          }
        }

        set((state) => ({
          plannerBlocks: [...state.plannerBlocks, newBlock]
        }));
      },

      removePlannerBlock: async (id) => {
        const state = useStore.getState();
        if (state.user) {
          try {
            const path = `users/${state.user.uid}/planner/${id}`;
            await deleteDoc(doc(db, path));
          } catch (error) {
            handleFirestoreError(error, OperationType.DELETE, `users/${state.user.uid}/planner/${id}`);
          }
        }

        set((state) => ({
          plannerBlocks: state.plannerBlocks.filter(b => b.id !== id)
        }));
      },

      setPlannerBlocks: (plannerBlocks) => set({ plannerBlocks }),
      setQuests: (quests) => set({ quests }),
      setFriends: (friends) => set({ friends }),

      joinGuild: async (guild) => {
        const state = useStore.getState();
        if (state.user) {
          try {
            // In a real app, we'd update the guild document's members array too
            const userDocRef = doc(db, 'users', state.user.uid);
            await updateDoc(userDocRef, { guildId: guild.id });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, `users/${state.user.uid}`);
          }
        }
        set({ guild });
      },
      
      addFriend: async (friend) => {
        const state = useStore.getState();
        if (state.user) {
          try {
            const friendDocRef = doc(db, 'users', state.user.uid, 'friends', friend.id);
            await setDoc(friendDocRef, {
              uid: friend.id,
              username: friend.name,
              addedAt: new Date().toISOString()
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.WRITE, `users/${state.user.uid}/friends/${friend.id}`);
          }
        }
        set((state) => ({
          friends: [...state.friends, friend]
        }));
      },
    }),
    {
      name: 'studyquest-storage',
    }
  )
);
