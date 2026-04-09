/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import Roadmap from '../Roadmap/Roadmap';
import { 
  Trophy, 
  Clock, 
  Flame, 
  Target, 
  ChevronRight, 
  Plus,
  Calendar,
  Sword,
  Map
} from 'lucide-react';
import { cn } from '../../lib/utils';

import { ThemeButton, ThemeCard, ThemeProgress } from '../ui/ThemeComponents';

export default function Dashboard() {
  const { character, quests, sessions, language } = useStore();
  const [showRoadmap, setShowRoadmap] = React.useState(false);

  if (!character) return null;

  const t = {
    en: {
      experience: 'Experience',
      streak: 'Day Streak',
      focus: 'Total Focus',
      untilBac: 'Until BAC 2026',
      viewRoadmap: 'View Roadmap',
      activeQuests: 'Active Quests',
      timeline: 'Timeline',
      noQuests: 'No Active Quests'
    },
    ar: {
      experience: 'الخبرة',
      streak: 'أيام متتالية',
      focus: 'إجمالي التركيز',
      untilBac: 'حتى بكالوريا 2026',
      viewRoadmap: 'عرض خارطة الطريق',
      activeQuests: 'المهام النشطة',
      timeline: 'الجدول الزمني',
      noQuests: 'لا توجد مهام نشطة',
      days: 'أيام'
    }
  }[language];

  if (showRoadmap) {
    return <Roadmap onBack={() => setShowRoadmap(false)} />;
  }

  const activeQuests = quests.filter(q => !q.completed);
  const totalStudyTime = sessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Bento Grid Layout */}
      <div className="bento-grid">
        
        {/* Character Hero - Large Item */}
        <ThemeCard className="bento-item-large flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/10 blur-3xl rounded-full -mr-32 -mt-32 group-hover:bg-[var(--accent-primary)]/20 transition-colors" />
          
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start relative z-10">
            {/* Character Avatar */}
            <div className="w-32 h-32 md:w-40 md:h-40 neumorph flex items-center justify-center relative group/avatar shrink-0 rounded-[3rem]">
              <Sword className="w-12 h-12 md:w-16 md:h-16 text-[var(--accent-primary)] group-hover/avatar:scale-110 transition-transform animate-float" />
              <div className="absolute -bottom-3 -right-3 bg-[var(--accent-primary)] px-4 py-1 rounded-full font-bold text-sm shadow-lg shadow-[var(--accent-primary)]/40">
                LVL {character.level}
              </div>
            </div>

            <div className="flex-1 space-y-6 w-full text-center md:text-left">
              <div className="space-y-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-[var(--text-secondary)] bg-clip-text text-transparent">
                  {character.name}
                </h1>
                <p className="text-[var(--text-secondary)] font-bold uppercase tracking-[0.2em] text-[10px]">
                  {character.origin} • {useStore.getState().selectedStream}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-[var(--text-secondary)]">{t.experience}</span>
                  <span className="text-[var(--accent-primary)]">{character.xp} / {character.maxXp} XP</span>
                </div>
                <ThemeProgress value={character.xp} max={character.maxXp} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(character.stats).map(([key, val]) => (
                  <ThemeCard key={key} className="p-3 text-center group/stat hover:scale-[1.05] transition-all rounded-2xl">
                    <div className="text-[var(--text-secondary)] text-[9px] uppercase font-black mb-1 group-hover/stat:text-[var(--accent-primary)] transition-colors">{key}</div>
                    <div className="text-lg font-black">{val}</div>
                  </ThemeCard>
                ))}
              </div>
            </div>
          </div>
        </ThemeCard>

        {/* Stats Cards - Small Items */}
        <div className="grid grid-cols-2 gap-4">
          <ThemeCard className="flex flex-col justify-center items-center gap-2 group hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-2xl md:text-3xl font-black">5</div>
            <div className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{t.streak}</div>
          </ThemeCard>

          <ThemeCard className="flex flex-col justify-center items-center gap-2 group hover:scale-[1.02] transition-transform">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-2xl md:text-3xl font-black">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</div>
            <div className="text-[10px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{t.focus}</div>
          </ThemeCard>
        </div>

        {/* BAC Countdown - Wide Item */}
        <ThemeCard className="bento-item-wide flex flex-col sm:flex-row items-center justify-between gap-6 group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 md:gap-6 relative z-10">
            <ThemeCard className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shrink-0">
              <Target className="w-7 h-7 md:w-8 md:h-8 text-red-500 animate-pulse" />
            </ThemeCard>
            <div className="text-center sm:text-left">
              <div className="text-3xl md:text-4xl font-black tracking-tighter">64 {language === 'ar' ? t.days : 'Days'}</div>
              <div className="text-[10px] md:text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">{t.untilBac}</div>
            </div>
          </div>
          <ThemeButton 
            onClick={() => setShowRoadmap(true)}
            className="w-full sm:w-auto text-xs uppercase tracking-widest relative z-10"
          >
            {t.viewRoadmap}
          </ThemeButton>
        </ThemeCard>

        {/* Active Quests - Tall Item */}
        <ThemeCard className="hidden lg:flex bento-item-tall flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <Target className="w-5 h-5 text-[var(--accent-primary)]" />
              {t.activeQuests}
            </h2>
            <ThemeButton className="w-8 h-8 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </ThemeButton>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide pr-2">
            {activeQuests.length > 0 ? (
              activeQuests.map((quest) => (
                <ThemeCard
                  key={quest.id}
                  onClick={() => {}}
                  className="p-4 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition-all"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    quest.priority === 'High' ? "bg-red-500/10 text-red-500" : quest.priority === 'Medium' ? "bg-yellow-500/10 text-yellow-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{quest.title}</div>
                    <div className="text-[9px] text-[var(--text-secondary)] font-bold uppercase">{quest.subject}</div>
                  </div>
                </ThemeCard>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                <Target className="w-12 h-12 mb-2" />
                <p className="text-xs font-bold uppercase">{t.noQuests}</p>
              </div>
            )}
          </div>
        </ThemeCard>

        {/* Daily Planner Preview */}
        <ThemeCard className="hidden lg:flex bento-item-wide flex-col gap-6">
          <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
            {t.timeline}
          </h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {[8, 10, 12, 14, 16, 18, 20].map((hour) => (
              <div key={hour} className="flex flex-col items-center gap-3 min-w-[80px]">
                <div className="text-[10px] font-black text-[var(--text-secondary)]">{hour}:00</div>
                <ThemeCard 
                  onClick={() => {}}
                  className={cn(
                    "w-full h-24 flex items-center justify-center group cursor-pointer hover:scale-[1.05] transition-all",
                    hour === 10 && "bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/30"
                  )}
                >
                  {hour === 10 && <div className="w-1 h-12 bg-[var(--accent-primary)] rounded-full" />}
                </ThemeCard>
              </div>
            ))}
          </div>
        </ThemeCard>

      </div>
    </div>
  );
}

// Helper components
function BookOpen({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
