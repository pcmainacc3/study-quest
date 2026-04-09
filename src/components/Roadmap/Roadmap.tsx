/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  Map, 
  CheckCircle2, 
  Circle, 
  Lock, 
  ChevronRight, 
  BookOpen, 
  Target,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { STREAM_DATA } from '../../types';

interface RoadmapProps {
  onBack: () => void;
}

import { ThemeCard, ThemeButton } from '../ui/ThemeComponents';

export default function Roadmap({ onBack }: RoadmapProps) {
  const { selectedStream, language } = useStore();
  
  const subjects = selectedStream ? STREAM_DATA[selectedStream].subjects : [];
  
  const t = {
    en: {
      title: 'Study Roadmap',
      subtitle: 'Your path to BAC 2026 mastery',
      back: 'Back to Dashboard',
      progress: 'Overall Progress',
      chapters: 'Chapters',
      locked: 'Locked',
      completed: 'Completed',
      inProgress: 'In Progress'
    },
    ar: {
      title: 'خارطة الطريق الدراسية',
      subtitle: 'مسارك نحو التفوق في بكالوريا 2026',
      back: 'العودة إلى لوحة القيادة',
      progress: 'التقدم العام',
      chapters: 'الفصول',
      locked: 'مغلق',
      completed: 'مكتمل',
      inProgress: 'قيد التنفيذ',
      module: 'وحدة'
    }
  }[language];

  // Mock Roadmap Data
  const roadmapData = subjects.map(subject => ({
    name: subject.name,
    color: subject.color,
    progress: Math.floor(Math.random() * 100),
    chapters: [
      { id: '1', title: 'Chapter 1: Fundamentals', status: 'completed' },
      { id: '2', title: 'Chapter 2: Advanced Concepts', status: 'in-progress' },
      { id: '3', title: 'Chapter 3: Practical Applications', status: 'locked' },
      { id: '4', title: 'Chapter 4: Final Review', status: 'locked' },
    ]
  }));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <ThemeButton 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-[10px]"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </ThemeButton>
        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-[10px] font-black uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          {selectedStream}
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-4">
          <Map className="w-10 h-10 text-[var(--accent-primary)]" />
          {t.title}
        </h1>
        <p className="text-[var(--text-secondary)] font-bold">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Navigation */}
        <div className="lg:col-span-1 space-y-4">
          {roadmapData.map((subject) => (
            <ThemeCard 
              key={subject.name}
              className="space-y-4 hover:scale-[1.02] transition-transform cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: subject.color }}
                  >
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="font-black uppercase tracking-tight">{subject.name}</span>
                </div>
                <div className="text-xs font-black text-[var(--accent-primary)]">{subject.progress}%</div>
              </div>
              <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${subject.progress}%` }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
              </div>
            </ThemeCard>
          ))}
        </div>

        {/* Chapter Details */}
        <div className="lg:col-span-2 space-y-6">
          <ThemeCard className="space-y-8">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter">{t.chapters}</h2>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[var(--text-secondary)]">
                  <div className="w-2 h-2 rounded-full bg-green-500" /> {t.completed}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-[var(--text-secondary)]">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" /> {t.inProgress}
                </div>
              </div>
            </div>

            <div className="space-y-4 relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--border-color)] z-0" />

              {roadmapData[0].chapters.map((chapter, i) => (
                <div key={chapter.id} className="flex gap-6 relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xl",
                    chapter.status === 'completed' ? "bg-green-500 text-white" : 
                    chapter.status === 'in-progress' ? "bg-[var(--accent-primary)] text-white" : 
                    "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                  )}>
                    {chapter.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : 
                     chapter.status === 'in-progress' ? <Circle className="w-6 h-6 animate-pulse" /> : 
                     <Lock className="w-6 h-6" />}
                  </div>
                  <ThemeCard
                    onClick={() => {}}
                    className={cn(
                      "flex-1 p-6 transition-all",
                      chapter.status === 'locked' ? "opacity-50 pointer-events-none" : "cursor-pointer hover:scale-[1.01]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-1">
                          {language === 'ar' ? t.module : 'Module'} {i + 1}
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight">{chapter.title}</h3>
                      </div>
                      {chapter.status !== 'locked' && <ChevronRight className="w-5 h-5 text-[var(--text-secondary)]" />}
                    </div>
                  </ThemeCard>
                </div>
              ))}
            </div>
          </ThemeCard>
        </div>
      </div>
    </motion.div>
  );
}
