/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Coffee,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ThemeButton, ThemeCard, ThemeInput } from '../ui/ThemeComponents';
import { cn } from '../../lib/utils';

export default function Planner() {
  const { plannerBlocks, addPlannerBlock, removePlannerBlock, language } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', subject: '', type: 'study' as const, hour: 9, duration: 1 });

  const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM to 10 PM

  const t = {
    en: {
      title: 'Daily Planner',
      subtitle: 'AI-Optimized scheduling for maximum retention',
      aiButton: 'AI Auto-Schedule',
      studyStats: 'Study Stats',
      dailyGoal: 'Daily Goal',
      planned: 'Planned',
      done: 'Done',
      addTitle: 'Add New Task',
      taskTitle: 'Task Title',
      subject: 'Subject',
      type: 'Type',
      time: 'Time (Hour)',
      duration: 'Duration (Hours)',
      hour: 'Hour',
      min: 'Min',
      add: 'Add Task',
      cancel: 'Cancel',
      study: 'Study',
      break: 'Break',
      review: 'Review',
      april: 'April 2026'
    },
    ar: {
      title: 'المخطط اليومي',
      subtitle: 'جدولة محسنة بالذكاء الاصطناعي لأقصى قدر من الاستيعاب',
      aiButton: 'جدولة تلقائية ذكية',
      studyStats: 'إحصائيات الدراسة',
      dailyGoal: 'الهدف اليومي',
      planned: 'مخطط له',
      done: 'تم إنجازه',
      addTitle: 'إضافة مهمة جديدة',
      taskTitle: 'عنوان المهمة',
      subject: 'المادة',
      type: 'النوع',
      time: 'الوقت (الساعة)',
      duration: 'المدة (ساعات)',
      hour: 'ساعة',
      min: 'دقيقة',
      add: 'إضافة المهمة',
      cancel: 'إلغاء',
      study: 'دراسة',
      break: 'استراحة',
      review: 'مراجعة',
      april: 'أفريل 2026',
      taskPlaceholder: 'مثلاً: دراسة الفيزياء',
      subjectPlaceholder: 'مثلاً: فيزياء',
      morningFocus: 'تركيز صباحي',
      quickBreak: 'استراحة سريعة',
      physicsDeepDive: 'تعمق في الفيزياء',
      mathematics: 'الرياضيات',
      physics: 'الفيزياء',
      technology: 'التكنولوجيا',
      historyGeography: 'التاريخ والجغرافيا',
      philosophy: 'الفلسفة',
      english: 'الإنجليزية',
      french: 'الفرنسية',
      islamic: 'العلوم الإسلامية',
      naturalSciences: 'العلوم الطبيعية',
      rest: 'راحة',
      general: 'عام'
    }
  }[language];

  const handleAddTask = () => {
    if (!newTask.title) return;
    
    // Use the selected date instead of current date
    const startTime = new Date(selectedDate);
    startTime.setHours(newTask.hour, 0, 0, 0);
    
    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + newTask.duration * 60);

    addPlannerBlock({
      title: newTask.title,
      subject: newTask.subject || (newTask.type === 'study' ? (language === 'ar' ? t.general : 'General') : (language === 'ar' ? t.rest : 'Rest')),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      type: newTask.type
    });

    setNewTask({ title: '', subject: '', type: 'study', hour: 9, duration: 1 });
    setShowAddModal(false);
  };

  const generateAISchedule = () => {
    // Mock AI schedule generation for the selected date
    const baseDate = new Date(selectedDate);
    
    const createISO = (hour: number, minute: number = 0) => {
      const d = new Date(baseDate);
      d.setHours(hour, minute, 0, 0);
      return d.toISOString();
    };

    const mockBlocks = [
      { 
        title: language === 'ar' ? t.morningFocus : 'Morning Focus', 
        subject: language === 'ar' ? t.mathematics : 'Mathematics', 
        startTime: createISO(8), 
        endTime: createISO(10), 
        type: 'study' 
      },
      { 
        title: language === 'ar' ? t.quickBreak : 'Quick Break', 
        subject: language === 'ar' ? t.rest : 'Rest', 
        startTime: createISO(10), 
        endTime: createISO(10, 15), 
        type: 'break' 
      },
      { 
        title: language === 'ar' ? t.physicsDeepDive : 'Physics Deep Dive', 
        subject: language === 'ar' ? t.physics : 'Physics', 
        startTime: createISO(10, 15), 
        endTime: createISO(12, 15), 
        type: 'study' 
      },
    ];
    mockBlocks.forEach(b => addPlannerBlock(b as any));
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
            <Calendar className="w-10 h-10 text-[var(--accent-primary)]" />
            {t.title}
          </h1>
          <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">
            {t.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={generateAISchedule}
            className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] px-6 py-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-lg shadow-[var(--accent-primary)]/20 hover:scale-[1.02] transition-all group"
          >
            <Zap className="w-5 h-5 text-white animate-pulse" />
            {t.aiButton}
          </button>
          <ThemeButton 
            onClick={() => setShowAddModal(true)}
            className="w-14 h-14 flex items-center justify-center"
          >
            <Plus className="w-6 h-6" />
          </ThemeButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Calendar Sidebar */}
        <div className="space-y-6">
          <ThemeCard className="space-y-6">
            <div className="flex items-center justify-between">
              <ThemeButton 
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setSelectedDate(newDate);
                }}
                className="w-8 h-8 flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </ThemeButton>
              <div className="font-black uppercase tracking-widest text-xs">
                {selectedDate.toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' })}
              </div>
              <ThemeButton 
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setSelectedDate(newDate);
                }}
                className="w-8 h-8 flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </ThemeButton>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {language === 'en' ? 
                ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-[9px] font-black text-[var(--text-secondary)] mb-2">{d}</div>
                )) :
                ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map((d, i) => (
                  <div key={`${d}-${i}`} className="text-[9px] font-black text-[var(--text-secondary)] mb-2">{d}</div>
                ))
              }
              {Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const isSelected = selectedDate.getDate() === day;
                return (
                  <ThemeButton 
                    key={i} 
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(day);
                      setSelectedDate(newDate);
                    }}
                    className={cn(
                      "w-8 h-8 text-[10px]",
                      isSelected ? "bg-[var(--accent-primary)] text-white" : "text-[var(--text-secondary)]"
                    )}
                  >
                    {day}
                  </ThemeButton>
                );
              })}
            </div>
          </ThemeCard>

          <ThemeCard className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
              {t.studyStats}
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                  <span>{t.dailyGoal}</span>
                  <span>75%</span>
                </div>
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--accent-primary)] w-[75%] rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ThemeCard className="p-3 text-center">
                  <div className="text-[18px] font-black">4.2h</div>
                  <div className="text-[8px] font-black uppercase text-[var(--text-secondary)]">{t.planned}</div>
                </ThemeCard>
                <ThemeCard className="p-3 text-center">
                  <div className="text-[18px] font-black">2.5h</div>
                  <div className="text-[8px] font-black uppercase text-[var(--text-secondary)]">{t.done}</div>
                </ThemeCard>
              </div>
            </div>
          </ThemeCard>
        </div>

        {/* Timeline View */}
        <ThemeCard className="lg:col-span-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)]/5 blur-3xl rounded-full -mr-48 -mt-48" />
          
          <div className="space-y-0 relative z-10">
            {hours.map((hour) => {
              const blocksInHour = plannerBlocks.filter(b => {
                const blockDate = new Date(b.startTime);
                const isSameDay = 
                  blockDate.getDate() === selectedDate.getDate() &&
                  blockDate.getMonth() === selectedDate.getMonth() &&
                  blockDate.getFullYear() === selectedDate.getFullYear();
                
                return isSameDay && blockDate.getHours() === hour;
              });

              return (
                <div key={hour} className="flex gap-6 group">
                  <div className="w-16 py-8 text-right">
                    <span className="text-xs font-black text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      {hour}:00
                    </span>
                  </div>
                  
                  <div className="flex-1 border-l border-[var(--border-color)] relative py-8 pl-8">
                    <div className="absolute left-0 top-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--border-color)] group-hover:bg-[var(--accent-primary)] transition-colors border-2 border-[var(--bg-primary)]" />
                    
                    {blocksInHour.length > 0 ? (
                      <div className="space-y-4">
                        {blocksInHour.map((block) => (
                          <ThemeCard
                            key={block.id}
                            onClick={() => {}}
                            className={cn(
                              "p-5 flex items-center justify-between group/block hover:scale-[1.01] transition-all cursor-pointer border-l-4",
                              block.type === 'study' ? "border-blue-500" : block.type === 'break' ? "border-green-500" : "border-purple-500"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center",
                                block.type === 'study' ? "bg-blue-500/10 text-blue-500" : block.type === 'break' ? "bg-green-500/10 text-green-500" : "bg-purple-500/10 text-purple-500"
                              )}>
                                {block.type === 'study' ? <BookOpen className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
                              </div>
                              <div>
                                <div className="font-black text-sm">{block.title}</div>
                                <div className="flex items-center gap-2">
                                  <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{block.subject}</div>
                                  <div className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                                  <div className="text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-widest">
                                    {Math.round((new Date(block.endTime).getTime() - new Date(block.startTime).getTime()) / 60000)} {language === 'ar' ? t.min : 'min'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <ThemeButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                removePlannerBlock(block.id);
                              }}
                              className="w-8 h-8 opacity-0 group-hover/block:opacity-100 transition-opacity flex items-center justify-center hover:text-red-500"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </ThemeButton>
                          </ThemeCard>
                        ))}
                      </div>
                    ) : (
                      <div className="h-12 flex items-center opacity-0 group-hover:opacity-20 transition-opacity">
                        <div className="w-full h-px bg-dashed border-t border-dashed border-[var(--text-secondary)]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ThemeCard>

      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <ThemeCard className="w-full max-w-md relative z-10 space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tighter">{t.addTitle}</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.taskTitle}</label>
                  <ThemeInput 
                    value={newTask.title}
                    onChange={(val) => setNewTask({...newTask, title: val})}
                    placeholder={language === 'ar' ? t.taskPlaceholder : "e.g. Study Physics"}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.subject}</label>
                  <ThemeInput 
                    value={newTask.subject}
                    onChange={(val) => setNewTask({...newTask, subject: val})}
                    placeholder={language === 'ar' ? t.subjectPlaceholder : "e.g. Physics"}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.type}</label>
                    <select 
                      value={newTask.type}
                      onChange={(e) => setNewTask({...newTask, type: e.target.value as any})}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    >
                      <option value="study">{t.study}</option>
                      <option value="break">{t.break}</option>
                      <option value="review">{t.review}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.time}</label>
                    <select 
                      value={newTask.hour}
                      onChange={(e) => setNewTask({...newTask, hour: parseInt(e.target.value)})}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    >
                      {hours.map(h => (
                        <option key={h} value={h}>{h}:00</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.duration}</label>
                    <select 
                      value={newTask.duration}
                      onChange={(e) => setNewTask({...newTask, duration: parseFloat(e.target.value)})}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
                    >
                      <option value={0.5}>30 {language === 'ar' ? t.min : 'min'}</option>
                      <option value={1}>1 {language === 'ar' ? t.hour : 'hour'}</option>
                      <option value={1.5}>1.5 {language === 'ar' ? t.hour : 'hours'}</option>
                      <option value={2}>2 {language === 'ar' ? t.hour : 'hours'}</option>
                      <option value={3}>3 {language === 'ar' ? t.hour : 'hours'}</option>
                      <option value={4}>4 {language === 'ar' ? t.hour : 'hours'}</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <ThemeButton 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 text-xs opacity-70 hover:opacity-100"
                >
                  {t.cancel}
                </ThemeButton>
                <ThemeButton 
                  onClick={handleAddTask}
                  className="flex-1 py-4 text-xs"
                >
                  {t.add}
                </ThemeButton>
              </div>
            </ThemeCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
