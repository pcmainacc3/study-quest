/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { 
  Plus, 
  ScrollText, 
  BookOpen, 
  Check, 
  X,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { STREAM_DATA } from '../../types';

import { ThemeButton, ThemeCard, ThemeInput } from '../ui/ThemeComponents';

export default function QuestLog() {
  const { quests, toggleQuest, addQuest, selectedStream, language } = useStore();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    subject: selectedStream ? STREAM_DATA[selectedStream].subjects[0].name : 'Mathematics',
    priority: 'Medium' as const
  });

  const t = {
    en: {
      title: 'Quest Log',
      subtitle: 'Manage your academic journey and earn rewards',
      newQuest: 'New Quest',
      all: 'All',
      active: 'Active',
      completed: 'Completed',
      reward: 'Reward',
      inProgress: 'In Progress',
      noQuests: 'No Quests Found',
      noQuestsSub: 'Your journey is waiting for its next chapter.',
      questTitle: 'Quest Title',
      subject: 'Subject',
      priority: 'Priority',
      accept: 'Accept Quest',
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    },
    ar: {
      title: 'سجل المهام',
      subtitle: 'إدارة رحلتك الأكاديمية وكسب المكافآت',
      newQuest: 'مهمة جديدة',
      all: 'الكل',
      active: 'نشط',
      completed: 'مكتمل',
      reward: 'مكافأة',
      inProgress: 'قيد التنفيذ',
      noQuests: 'لم يتم العثور على مهام',
      noQuestsSub: 'رحلتك تنتظر فصلها القادم.',
      questTitle: 'عنوان المهمة',
      subject: 'المادة',
      priority: 'الأولوية',
      accept: 'قبول المهمة',
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية'
    }
  }[language];

  const filteredQuests = quests.filter(q => {
    if (filter === 'Active') return !q.completed;
    if (filter === 'Completed') return q.completed;
    return true;
  });

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
            <ScrollText className="w-10 h-10 text-[var(--accent-primary)]" />
            {t.title}
          </h1>
          <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">
            {t.subtitle}
          </p>
        </div>

        <ThemeButton 
          onClick={() => setIsAddModalOpen(true)}
          className="px-8 py-4 flex items-center gap-3 text-xs group"
        >
          <Plus className="w-5 h-5 text-[var(--accent-primary)] group-hover:rotate-90 transition-transform" />
          {t.newQuest}
        </ThemeButton>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Active', 'Completed'].map((f) => (
          <ThemeButton
            key={f}
            onClick={() => setFilter(f as any)}
            className={cn(
              "px-6 py-2 text-[10px] whitespace-nowrap",
              filter === f 
                ? "bg-[var(--accent-primary)] text-white shadow-lg" 
                : "text-[var(--text-secondary)]"
            )}
          >
            {f === 'All' ? t.all : f === 'Active' ? t.active : t.completed}
          </ThemeButton>
        ))}
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredQuests.length > 0 ? (
            filteredQuests.map((quest) => (
              <ThemeCard
                key={quest.id}
                className={cn(
                  "flex flex-col gap-4 group hover:scale-[1.02] transition-all",
                  quest.completed && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    quest.priority === 'High' ? "bg-red-500/10 text-red-500" : quest.priority === 'Medium' ? "bg-yellow-500/10 text-yellow-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-[var(--accent-primary)] font-black text-sm">+{quest.xpReward} XP</div>
                    <div className="text-[9px] text-[var(--text-secondary)] font-black uppercase tracking-widest">{t.reward}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className={cn(
                    "text-xl font-black tracking-tight",
                    quest.completed && "line-through"
                  )}>{quest.title}</h3>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-[var(--bg-secondary)] px-2 py-1 rounded-md">
                      {quest.subject}
                    </span>
                    <span className="text-[10px] font-bold">• {quest.dueDate}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                      {quest.completed ? t.completed : t.inProgress}
                    </span>
                  </div>
                  <ThemeButton 
                    onClick={() => toggleQuest(quest.id)}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center transition-all",
                      quest.completed 
                        ? "bg-green-500/20 text-green-500" 
                        : "text-[var(--text-secondary)]"
                    )}
                  >
                    {quest.completed ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </ThemeButton>
                </div>
              </ThemeCard>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-40">
              <ScrollText className="w-20 h-20 mb-4" />
              <h3 className="text-2xl font-black uppercase tracking-widest">{t.noQuests}</h3>
              <p className="text-sm font-bold">{t.noQuestsSub}</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Quest Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <ThemeCard className="w-full max-w-lg relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tighter">{t.newQuest}</h2>
                <ThemeButton 
                  onClick={() => setIsAddModalOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </ThemeButton>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-2">{t.questTitle}</label>
                  <ThemeInput 
                    value={newQuest.title}
                    onChange={(val) => setNewQuest({ ...newQuest, title: val })}
                    placeholder="e.g., Master Calculus Limits" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-2">{t.subject}</label>
                    <select 
                      value={newQuest.subject}
                      onChange={(e) => setNewQuest({ ...newQuest, subject: e.target.value })}
                      className="w-full neumorph bg-transparent p-4 rounded-2xl outline-none font-bold appearance-none"
                    >
                      {selectedStream && STREAM_DATA[selectedStream].subjects.map(s => (
                        <option key={s.name} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] px-2">{t.priority}</label>
                    <select 
                      value={newQuest.priority}
                      onChange={(e) => setNewQuest({ ...newQuest, priority: e.target.value as any })}
                      className="w-full neumorph bg-transparent p-4 rounded-2xl outline-none font-bold appearance-none"
                    >
                      <option value="Low">{t.low}</option>
                      <option value="Medium">{t.medium}</option>
                      <option value="High">{t.high}</option>
                    </select>
                  </div>
                </div>

                <ThemeButton 
                  onClick={() => {
                    if (!newQuest.title) return;
                    addQuest({
                      title: newQuest.title,
                      subject: newQuest.subject,
                      priority: newQuest.priority,
                      dueDate: 'Tomorrow',
                      xpReward: newQuest.priority === 'High' ? 100 : newQuest.priority === 'Medium' ? 50 : 25
                    });
                    setNewQuest({
                      title: '',
                      subject: selectedStream ? STREAM_DATA[selectedStream].subjects[0].name : 'Mathematics',
                      priority: 'Medium'
                    });
                    setIsAddModalOpen(false);
                  }}
                  className="w-full py-5"
                >
                  {t.accept}
                </ThemeButton>
              </div>
            </ThemeCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
