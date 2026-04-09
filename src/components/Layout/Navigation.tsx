/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Home, 
  Target, 
  Clock, 
  Calendar, 
  User, 
  Settings, 
  Shield,
  LogOut,
  Palette,
  LayoutDashboard,
  Timer,
  ScrollText,
  Users,
  Compass,
  Languages
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { useStore } from '../../store/useStore';
import { THEMES as THEMES_DATA } from '../../lib/themes';

const THEMES = [
  'Scholar\'s Sanctum',
  'Aurora Borealis',
  'Neon Noir',
  'Koi Pond',
  'Lo-Fi Desk',
  'Hologram Station',
  'Morning Coffee',
  'Synthwave Sunset',
  'Underwater Depth',
  'Paper Craft',
  'Isometric City',
  'Magma Chamber',
  'Cloud Nine',
  'Vaporwave Temple',
  'Forest Canopy',
  'Quantum Field',
  'Ink in Water',
  'Retro Arcade',
  'Zen Garden 2.0',
  'Space Elevator',
  'Alchemy Lab'
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Timer, label: 'Focus', id: 'focus' },
  { icon: ScrollText, label: 'Quests', id: 'quests' },
  { icon: Calendar, label: 'Planner', id: 'planner' },
  { icon: Users, label: 'Social', id: 'social' },
  { icon: User, label: 'Profile', id: 'profile' },
];

export function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  const { theme: storeTheme, setTheme, character, language, setLanguage } = useStore();
  const currentTheme = storeTheme?.typography ? storeTheme : THEMES_DATA['Aurora Borealis'];
  const [showThemes, setShowThemes] = React.useState(false);

  const t = {
    en: {
      dashboard: 'Dashboard',
      focus: 'Focus',
      quests: 'Quests',
      planner: 'Planner',
      social: 'Social',
      profile: 'Profile',
      themes: 'Themes',
      settings: 'Settings',
      language: 'Arabic',
      appName: "The Scholar's Compass"
    },
    ar: {
      dashboard: 'لوحة القيادة',
      focus: 'التركيز',
      quests: 'المهام',
      planner: 'المخطط',
      social: 'التواصل',
      profile: 'الملف الشخصي',
      themes: 'المظاهر',
      settings: 'الإعدادات',
      language: 'English',
      appName: 'بوصلة الطالب'
    }
  }[language];

  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: t.dashboard, id: 'dashboard' },
    { icon: Timer, label: t.focus, id: 'focus' },
    { icon: ScrollText, label: t.quests, id: 'quests' },
    { icon: Calendar, label: t.planner, id: 'planner' },
    { icon: Users, label: t.social, id: 'social' },
    { icon: User, label: t.profile, id: 'profile' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-2rem)] sticky top-4 ml-4 glass border border-[var(--border-color)] p-6 z-50 rounded-[3rem]">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-[var(--accent-primary)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20 animate-float">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-black tracking-tighter uppercase leading-tight">{t.appName}</span>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm uppercase tracking-widest group",
              activeTab === item.id 
                ? "bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20" 
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-transform group-hover:scale-110",
              activeTab === item.id ? "text-white" : "text-[var(--text-secondary)]"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-4 px-4 py-4 mb-2 rounded-2xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)]">
          <div className="w-10 h-10 rounded-full overflow-hidden neumorph flex items-center justify-center">
            {character?.avatarUrl ? (
              <img src={character.avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-xs font-black">
                {character?.name?.[0] || 'S'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black uppercase tracking-tight truncate">{character?.name}</div>
            <div className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Lvl {character?.level} {character?.origin}</div>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all font-bold text-sm uppercase tracking-widest group"
          >
            <Languages className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {t.language}
          </button>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowThemes(!showThemes)}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-all font-bold text-sm uppercase tracking-widest group"
          >
            <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            {t.themes}
          </button>
          
          <AnimatePresence>
            {showThemes && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-full left-0 w-full mb-2 glass rounded-2xl p-2 max-h-64 overflow-y-auto scrollbar-hide border border-[var(--border-color)] shadow-2xl"
              >
                {THEMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTheme(t);
                      setShowThemes(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors",
                      currentTheme.name === t ? "bg-[var(--accent-primary)] text-white" : "hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-all font-bold text-sm uppercase tracking-widest group">
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          {t.settings}
        </button>
      </div>
    </aside>
  );
}

export function BottomNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  const { language } = useStore();
  const t = {
    en: {
      dashboard: 'Dashboard',
      focus: 'Focus',
      quests: 'Quests',
      planner: 'Planner',
      social: 'Social',
      profile: 'Profile',
    },
    ar: {
      dashboard: 'لوحة القيادة',
      focus: 'التركيز',
      quests: 'المهام',
      planner: 'المخطط',
      social: 'التواصل',
      profile: 'الملف الشخصي',
    }
  }[language];

  const NAV_ITEMS = [
    { icon: LayoutDashboard, label: t.dashboard, id: 'dashboard' },
    { icon: Timer, label: t.focus, id: 'focus' },
    { icon: ScrollText, label: t.quests, id: 'quests' },
    { icon: Calendar, label: t.planner, id: 'planner' },
    { icon: Users, label: t.social, id: 'social' },
    { icon: User, label: t.profile, id: 'profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-4 left-4 right-4 glass border border-[var(--border-color)] px-4 py-4 flex justify-between items-center z-50 rounded-[2.5rem] shadow-2xl">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all relative group",
            activeTab === item.id ? "text-[var(--accent-primary)]" : "text-[var(--text-secondary)]"
          )}
        >
          {activeTab === item.id && (
            <motion.div 
              layoutId="bottomNavGlow"
              className="absolute -top-2 w-8 h-1 bg-[var(--accent-primary)] rounded-full shadow-[0_0_10px_var(--accent-primary)]"
            />
          )}
          <item.icon className={cn("w-6 h-6 transition-transform", activeTab === item.id && "scale-110")} />
          <span className="text-[9px] font-black uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
