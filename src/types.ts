/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BacStream = 
  | 'Mathematics' 
  | 'Technical Mathematics' 
  | 'Experimental Sciences' 
  | 'Letters & Philosophy' 
  | 'Foreign Languages' 
  | 'Management & Economics';

export interface Subject {
  name: string;
  coefficient: number;
  color: string;
}

export const STREAM_DATA: Record<BacStream, { subjects: Subject[], description: string }> = {
  'Mathematics': {
    description: 'Focus on advanced calculus, algebra, and physics.',
    subjects: [
      { name: 'Mathematics', coefficient: 7, color: '#3b82f6' },
      { name: 'Physics', coefficient: 6, color: '#6366f1' },
      { name: 'Arabic', coefficient: 3, color: '#ef4444' },
      { name: 'Philosophy', coefficient: 2, color: '#8b5cf6' },
      { name: 'French', coefficient: 2, color: '#10b981' },
      { name: 'English', coefficient: 2, color: '#f59e0b' },
      { name: 'Islamic Education', coefficient: 2, color: '#10b981' },
      { name: 'History & Geography', coefficient: 2, color: '#b45309' },
    ]
  },
  'Technical Mathematics': {
    description: 'Engineering focus with civil, mechanical, or electrical options.',
    subjects: [
      { name: 'Mathematics', coefficient: 6, color: '#3b82f6' },
      { name: 'Technology', coefficient: 7, color: '#f59e0b' },
      { name: 'Physics', coefficient: 6, color: '#6366f1' },
      { name: 'Arabic', coefficient: 3, color: '#ef4444' },
      { name: 'French', coefficient: 2, color: '#10b981' },
      { name: 'English', coefficient: 2, color: '#f59e0b' },
      { name: 'Islamic Education', coefficient: 2, color: '#10b981' },
      { name: 'History & Geography', coefficient: 2, color: '#b45309' },
      { name: 'Philosophy', coefficient: 2, color: '#8b5cf6' },
    ]
  },
  'Experimental Sciences': {
    description: 'Biology, chemistry, and natural sciences.',
    subjects: [
      { name: 'Natural Sciences', coefficient: 6, color: '#10b981' },
      { name: 'Physics', coefficient: 5, color: '#6366f1' },
      { name: 'Mathematics', coefficient: 5, color: '#3b82f6' },
      { name: 'Arabic', coefficient: 3, color: '#ef4444' },
      { name: 'French', coefficient: 2, color: '#10b981' },
      { name: 'English', coefficient: 2, color: '#f59e0b' },
      { name: 'Islamic Education', coefficient: 2, color: '#10b981' },
      { name: 'History & Geography', coefficient: 2, color: '#b45309' },
      { name: 'Philosophy', coefficient: 2, color: '#8b5cf6' },
    ]
  },
  'Letters & Philosophy': {
    description: 'Literature, history, and philosophical studies.',
    subjects: [
      { name: 'Philosophy', coefficient: 6, color: '#8b5cf6' },
      { name: 'Arabic', coefficient: 6, color: '#ef4444' },
      { name: 'History & Geography', coefficient: 4, color: '#b45309' },
      { name: 'French', coefficient: 3, color: '#3b82f6' },
      { name: 'English', coefficient: 3, color: '#10b981' },
      { name: 'Islamic Education', coefficient: 2, color: '#10b981' },
      { name: 'Mathematics', coefficient: 2, color: '#3b82f6' },
    ]
  },
  'Foreign Languages': {
    description: 'Multi-lingual focus with literature.',
    subjects: [
      { name: 'Arabic', coefficient: 5, color: '#ef4444' },
      { name: 'French', coefficient: 5, color: '#3b82f6' },
      { name: 'English', coefficient: 5, color: '#10b981' },
      { name: 'Third Language', coefficient: 4, color: '#f59e0b' },
      { name: 'Philosophy', coefficient: 2, color: '#8b5cf6' },
      { name: 'History & Geography', coefficient: 2, color: '#b45309' },
      { name: 'Islamic Education', coefficient: 2, color: '#10b981' },
      { name: 'Mathematics', coefficient: 2, color: '#3b82f6' },
    ]
  },
  'Management & Economics': {
    description: 'Accounting, economics, and law.',
    subjects: [
      { name: 'Accounting', coefficient: 6, color: '#06b6d4' },
      { name: 'Economics', coefficient: 5, color: '#84cc16' },
      { name: 'Mathematics', coefficient: 5, color: '#3b82f6' },
      { name: 'Arabic', coefficient: 3, color: '#ef4444' },
      { name: 'French', coefficient: 2, color: '#10b981' },
      { name: 'English', coefficient: 2, color: '#f59e0b' },
      { name: 'Islamic Education', coefficient: 2, color: '#10b981' },
      { name: 'History & Geography', coefficient: 2, color: '#b45309' },
      { name: 'Philosophy', coefficient: 2, color: '#8b5cf6' },
      { name: 'Law', coefficient: 4, color: '#6366f1' },
      { name: 'Management', coefficient: 4, color: '#f59e0b' },
    ]
  }
};

export const ALL_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Technology',
  'History & Geography',
  'Philosophy',
  'English',
  'French',
  'Islamic Education',
  'Arabic',
  'Natural Sciences',
  'Accounting',
  'Economics',
  'Law',
  'Management'
];

export type Origin = 
  | 'Myconid' | 'Basilisk' | 'Chimera' | 'Quicksilver Slime' 
  | 'Flame Attronach' | 'Minotaur' | 'Owlbear' | 'Dwarven Automaton' 
  | 'Vampire Lord' | 'Hydra' | 'Griffin' | 'Voidwalker'
  | 'Scout' | 'Golem' | 'Skeleton' | 'Necromancer'
  | 'Treant' | 'Harpy' | 'Kobold' | 'Mimic'
  | 'Ghost' | 'Gnome' | 'Centaur' | 'Sphinx'
  | 'Dark Elf Ranger' | 'Ogre' | 'Lich' | 'Drider';

export const ORIGIN_DATA: Record<Origin, { imageUrl: string, description: string }> = {
  'Myconid': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Myconid', description: 'Fungal guardian of the deep woods.' },
  'Basilisk': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Basilisk', description: 'Serpentine beast with a petrifying gaze.' },
  'Chimera': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Chimera', description: 'Triple-headed terror of myth.' },
  'Quicksilver Slime': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Slime', description: 'Amorphous metallic entity.' },
  'Flame Attronach': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Flame', description: 'Elemental of pure fire.' },
  'Minotaur': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Minotaur', description: 'Labyrinthine powerhouse.' },
  'Owlbear': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Owlbear', description: 'Ferocious hybrid of forest and sky.' },
  'Dwarven Automaton': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Robot', description: 'Ancient steam-powered sentinel.' },
  'Vampire Lord': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Vampire', description: 'Aristocratic master of the night.' },
  'Hydra': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Hydra', description: 'Multi-headed swamp dweller.' },
  'Griffin': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Griffin', description: 'Noble guardian of the high peaks.' },
  'Voidwalker': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Void', description: 'Shadowy entity from beyond.' },
  'Scout': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Scout', description: 'Agile explorer of the unknown.' },
  'Golem': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Golem', description: 'Living stone imbued with magic.' },
  'Skeleton': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Skeleton', description: 'Undead warrior of the crypt.' },
  'Necromancer': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Necro', description: 'Master of life and death.' },
  'Treant': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Treant', description: 'Ancient living tree.' },
  'Harpy': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Harpy', description: 'Winged scavenger of the cliffs.' },
  'Kobold': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Kobold', description: 'Cunning draconic scavenger.' },
  'Mimic': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Mimic', description: 'Deceptive predator of the dungeon.' },
  'Ghost': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ghost', description: 'Ethereal remnant of the past.' },
  'Gnome': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Gnome', description: 'Master of earth and illusion.' },
  'Centaur': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Centaur', description: 'Noble hybrid of man and horse.' },
  'Sphinx': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Sphinx', description: 'Riddle-master of the sands.' },
  'Dark Elf Ranger': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Elf', description: 'Shadowy marksman of the deep.' },
  'Ogre': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ogre', description: 'Brutish giant of the hills.' },
  'Lich': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Lich', description: 'Eternal master of dark magic.' },
  'Drider': { imageUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Spider', description: 'Cursed hybrid of drow and spider.' }
};

export interface Character {
  name: string;
  origin: Origin;
  level: number;
  xp: number;
  maxXp: number;
  gold: number;
  stats: {
    intelligence: number;
    stamina: number;
    focus: number;
  };
  equipment: {
    head?: string;
    body?: string;
    weapon?: string;
  };
  avatarUrl?: string;
}

export interface Quest {
  id: string;
  title: string;
  subject: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  completed: boolean;
  xpReward: number;
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // minutes
  timestamp: string;
  xpEarned: number;
}

export interface PlannerBlock {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  endTime: string;
  type: 'study' | 'break' | 'exam';
  completed: boolean;
}

export interface Guild {
  id: string;
  name: string;
  type: string;
  level: number;
  xp: number;
  members: string[];
}

export interface Friend {
  id: string;
  name: string;
  level: number;
  status: 'online' | 'offline' | 'studying';
}
