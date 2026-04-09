/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Sparkles, 
  Target,
  Brain,
  Coffee,
  Timer as TimerIcon,
  ChevronRight,
  Plus,
  X,
  Volume2,
  Bell,
  Zap,
  Flag
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';
import { STREAM_DATA } from '../../types';

import { ThemeButton, ThemeCard, ThemeInput } from '../ui/ThemeComponents';

export default function FocusTimer() {
  const { 
    character, 
    gainXp, 
    addSession, 
    timerSettings, 
    updateTimerSettings,
    quests,
    addQuest,
    toggleQuest,
    selectedStream,
    language
  } = useStore();
  
  const t = {
    en: {
      pomodoro: 'Pomodoro',
      stopwatch: 'Stopwatch',
      deepWork: 'Deep Work Session',
      shortRecovery: 'Short Recovery',
      longRest: 'Long Rest',
      activeFocus: 'Active Focus Tracking',
      selectQuest: 'Select Active Quest',
      timerSettings: 'Timer Settings',
      saveChanges: 'Save Changes',
      activeQuest: 'Active Quest',
      noQuests: 'No active quests found',
      createNew: 'Create New Quest',
      newQuest: 'New Quest',
      questTitle: 'Quest Title',
      subject: 'Subject',
      addQuest: 'Add Quest',
      durations: 'Durations (Minutes)',
      focus: 'Focus',
      short: 'Short',
      long: 'Long',
      behavior: 'Behavior',
      autoBreaks: 'Auto-start Breaks',
      autoPomodoros: 'Auto-start Pomodoros',
      audio: 'Audio & Feedback',
      volume: 'Volume'
    },
    ar: {
      pomodoro: 'بومودورو',
      stopwatch: 'ساعة توقيت',
      deepWork: 'جلسة عمل عميق',
      shortRecovery: 'استراحة قصيرة',
      longRest: 'راحة طويلة',
      activeFocus: 'تتبع التركيز النشط',
      selectQuest: 'اختر مهمة نشطة',
      timerSettings: 'إعدادات المؤقت',
      saveChanges: 'حفظ التغييرات',
      activeQuest: 'المهمة النشطة',
      noQuests: 'لم يتم العثور على مهام نشطة',
      createNew: 'إنشاء مهمة جديدة',
      newQuest: 'مهمة جديدة',
      questTitle: 'عنوان المهمة',
      subject: 'المادة',
      addQuest: 'إضافة المهمة',
      durations: 'المدد (بالدقائق)',
      focus: 'تركيز',
      short: 'قصيرة',
      long: 'طويلة',
      behavior: 'السلوك',
      autoBreaks: 'بدء الاستراحات تلقائياً',
      autoPomodoros: 'بدء الجلسات تلقائياً',
      audio: 'الصوت والتعليقات',
      volume: 'مستوى الصوت',
      generalStudy: 'دراسة عامة',
      questPlaceholder: 'مثلاً: حل 10 مسائل فيزياء',
      module: 'وحدة'
    }
  }[language];
  
  // Timer State
  const [timerType, setTimerType] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(timerSettings.focusDuration * 60);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [laps, setLaps] = useState<{ time: number, split: number }[]>([]);
  
  // UI State
  const [showSettings, setShowSettings] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [showQuestSelector, setShowQuestSelector] = useState(false);
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);

  // New Quest Form State
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestSubject, setNewQuestSubject] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeQuest = quests.find(q => q.id === activeQuestId);
  const availableSubjects = selectedStream ? STREAM_DATA[selectedStream].subjects : [];

  useEffect(() => {
    if (newQuestSubject === '' && availableSubjects.length > 0) {
      setNewQuestSubject(availableSubjects[0].name);
    }
  }, [availableSubjects]);

  // Pomodoro Logic
  useEffect(() => {
    if (timerType === 'pomodoro') {
      if (isActive && timeLeft > 0) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        handlePomodoroComplete();
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    } else {
      if (isActive) {
        timerRef.current = setInterval(() => {
          setStopwatchTime((prev) => prev + 10); // 10ms increments
        }, 10);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, timerType]);

  const handlePomodoroComplete = () => {
    setIsActive(false);
    if (mode === 'focus') {
      const xpGained = activeQuest ? activeQuest.xpReward + 25 : 25;
      gainXp(xpGained);
      addSession({
        duration: timerSettings.focusDuration,
        subject: activeQuest ? activeQuest.subject : (language === 'ar' ? t.generalStudy : 'General Study'),
        xpEarned: xpGained
      });

      if (activeQuestId) {
        toggleQuest(activeQuestId);
        setActiveQuestId(null);
      }

      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
      
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);
      
      if (newCount % timerSettings.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(timerSettings.longBreakDuration * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(timerSettings.shortBreakDuration * 60);
      }
      
      if (timerSettings.autoStartBreaks) setIsActive(true);
    } else {
      setMode('focus');
      setTimeLeft(timerSettings.focusDuration * 60);
      if (timerSettings.autoStartPomodoros) setIsActive(true);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    if (timerType === 'pomodoro') {
      const duration = mode === 'focus' ? timerSettings.focusDuration : 
                      mode === 'shortBreak' ? timerSettings.shortBreakDuration : 
                      timerSettings.longBreakDuration;
      setTimeLeft(duration * 60);
    } else {
      setStopwatchTime(0);
      setLaps([]);
    }
  };

  const addLap = () => {
    const lastLapTime = laps.length > 0 ? laps[laps.length - 1].time : 0;
    setLaps([...laps, { time: stopwatchTime, split: stopwatchTime - lastLapTime }]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatStopwatch = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === 'focus' ? timerSettings.focusDuration * 60 : 
                    mode === 'shortBreak' ? timerSettings.shortBreakDuration * 60 : 
                    timerSettings.longBreakDuration * 60;
  const progress = timerType === 'pomodoro' ? (timeLeft / totalTime) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 relative">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-[var(--bg-secondary)] rounded-2xl neumorph">
        <ThemeButton 
          onClick={() => { setTimerType('pomodoro'); setIsActive(false); }}
          className={cn(
            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
            timerType === 'pomodoro' ? "bg-[var(--accent-primary)] text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          <TimerIcon className="w-4 h-4" />
          {t.pomodoro}
        </ThemeButton>
        <ThemeButton 
          onClick={() => { setTimerType('stopwatch'); setIsActive(false); }}
          className={cn(
            "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
            timerType === 'stopwatch' ? "bg-[var(--accent-primary)] text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          )}
        >
          <TimerIcon className="w-4 h-4" />
          {t.stopwatch}
        </ThemeButton>
      </div>

      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: -100, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute z-50 pointer-events-none"
          >
            <div className="bg-[var(--accent-primary)] text-white px-6 py-3 rounded-full font-black shadow-2xl shadow-[var(--accent-primary)]/50 flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              +25 XP
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
        {/* Progress Ring (Pomodoro Only) */}
        {timerType === 'pomodoro' && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              className="fill-none stroke-[var(--bg-secondary)] stroke-[12px]"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="48%"
              className="fill-none stroke-[var(--accent-primary)] stroke-[12px] stroke-round"
              style={{
                pathLength: progress / 100,
                filter: 'drop-shadow(0 0 8px var(--accent-primary))'
              }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </svg>
        )}

        {/* Timer Display */}
        <div className="text-center space-y-4 relative z-10">
          <motion.div 
            key={mode}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent-primary)] flex items-center justify-center gap-2"
          >
            {timerType === 'pomodoro' ? (
              <>
                {mode === 'focus' ? <Brain className="w-4 h-4" /> : <Coffee className="w-4 h-4" />}
                {mode === 'focus' ? t.deepWork : mode === 'shortBreak' ? t.shortRecovery : t.longRest}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                {t.activeFocus}
              </>
            )}
          </motion.div>
          <div className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums">
            {timerType === 'pomodoro' ? formatTime(timeLeft) : formatStopwatch(stopwatchTime)}
          </div>
          
          <button 
            onClick={() => setShowQuestSelector(true)}
            className="flex items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors group"
          >
            <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {activeQuest ? activeQuest.title : t.selectQuest}
            </span>
            <ChevronRight className="w-3 h-3 opacity-50" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <ThemeButton 
          onClick={resetTimer}
          className="w-16 h-16 flex items-center justify-center text-[var(--text-secondary)]"
        >
          <RotateCcw className="w-6 h-6" />
        </ThemeButton>

        <ThemeButton 
          onClick={toggleTimer}
          className="w-24 h-24 flex items-center justify-center group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[var(--accent-primary)] opacity-0 group-hover:opacity-10 transition-opacity" />
          {isActive ? (
            <Pause className="w-10 h-10 text-[var(--accent-primary)]" fill="currentColor" />
          ) : (
            <Play className="w-10 h-10 text-[var(--accent-primary)] ml-1" fill="currentColor" />
          )}
        </ThemeButton>

        {timerType === 'stopwatch' ? (
          <div className="flex gap-4">
            <ThemeButton 
              onClick={addLap}
              disabled={!isActive}
              className="w-16 h-16 flex items-center justify-center text-[var(--text-secondary)] disabled:opacity-50"
            >
              <Flag className="w-6 h-6" />
            </ThemeButton>
            {stopwatchTime > 60000 && (
              <ThemeButton 
                onClick={() => {
                  const durationMins = Math.floor(stopwatchTime / 60000);
                  const xpGained = activeQuest ? activeQuest.xpReward + (durationMins * 2) : durationMins * 2;
                  gainXp(xpGained);
                  addSession({
                    duration: durationMins,
                    subject: activeQuest ? activeQuest.subject : (language === 'ar' ? t.generalStudy : 'General Study'),
                    xpEarned: xpGained
                  });
                  if (activeQuestId) {
                    toggleQuest(activeQuestId);
                    setActiveQuestId(null);
                  }
                  resetTimer();
                  setShowReward(true);
                  setTimeout(() => setShowReward(false), 3000);
                }}
                className="w-16 h-16 flex items-center justify-center text-[var(--accent-primary)]"
              >
                <Sparkles className="w-6 h-6" />
              </ThemeButton>
            )}
          </div>
        ) : (
          <ThemeButton 
            onClick={() => setShowSettings(true)}
            className="w-16 h-16 flex items-center justify-center text-[var(--text-secondary)]"
          >
            <Settings className="w-6 h-6" />
          </ThemeButton>
        )}
      </div>

      {/* Laps Display (Stopwatch Only) */}
      {timerType === 'stopwatch' && laps.length > 0 && (
        <ThemeCard className="w-full max-w-md space-y-4 max-h-48 overflow-y-auto">
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] border-b border-[var(--border-color)] pb-2">
            <span>Lap</span>
            <span>Split</span>
            <span>Total</span>
          </div>
          {laps.slice().reverse().map((lap, i) => (
            <div key={i} className="flex justify-between text-xs font-bold tabular-nums">
              <span className="text-[var(--text-secondary)]">#{laps.length - i}</span>
              <span>{formatStopwatch(lap.split)}</span>
              <span className="text-[var(--accent-primary)]">{formatStopwatch(lap.time)}</span>
            </div>
          ))}
        </ThemeCard>
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <ThemeCard className="relative w-full max-w-lg space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <Settings className="w-8 h-8 text-[var(--accent-primary)]" />
                  {t.timerSettings}
                </h2>
                <button onClick={() => setShowSettings(false)} className="w-10 h-10 neumorph flex items-center justify-center hover:neumorph-pressed transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {/* Durations */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.durations}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase">{t.focus}</label>
                      <ThemeInput 
                        type="number" 
                        value={timerSettings.focusDuration.toString()}
                        onChange={(val) => updateTimerSettings({ focusDuration: parseInt(val) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase">{t.short}</label>
                      <ThemeInput 
                        type="number" 
                        value={timerSettings.shortBreakDuration.toString()}
                        onChange={(val) => updateTimerSettings({ shortBreakDuration: parseInt(val) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase">{t.long}</label>
                      <ThemeInput 
                        type="number" 
                        value={timerSettings.longBreakDuration.toString()}
                        onChange={(val) => updateTimerSettings({ longBreakDuration: parseInt(val) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Behavior */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.behavior}</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-secondary)]/50 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
                      <span className="text-xs font-bold uppercase tracking-widest">{t.autoBreaks}</span>
                      <input 
                        type="checkbox" 
                        checked={timerSettings.autoStartBreaks}
                        onChange={(e) => updateTimerSettings({ autoStartBreaks: e.target.checked })}
                        className="w-5 h-5 rounded border-none bg-[var(--bg-primary)] text-[var(--accent-primary)] focus:ring-0"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-secondary)]/50 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors">
                      <span className="text-xs font-bold uppercase tracking-widest">{t.autoPomodoros}</span>
                      <input 
                        type="checkbox" 
                        checked={timerSettings.autoStartPomodoros}
                        onChange={(e) => updateTimerSettings({ autoStartPomodoros: e.target.checked })}
                        className="w-5 h-5 rounded border-none bg-[var(--bg-primary)] text-[var(--accent-primary)] focus:ring-0"
                      />
                    </label>
                  </div>
                </div>

                {/* Audio */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.audio}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-[var(--text-secondary)]" />
                        <span className="text-xs font-bold uppercase tracking-widest">{t.volume}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={timerSettings.volume}
                        onChange={(e) => updateTimerSettings({ volume: parseInt(e.target.value) })}
                        className="w-32 accent-[var(--accent-primary)]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <ThemeButton 
                onClick={() => setShowSettings(false)}
                className="w-full py-4 text-xs"
              >
                {t.saveChanges}
              </ThemeButton>
            </ThemeCard>
          </div>
        )}

        {/* Quest Selector Modal */}
        {showQuestSelector && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuestSelector(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <ThemeCard className="relative w-full max-w-lg space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <Target className="w-8 h-8 text-[var(--accent-primary)]" />
                  {t.activeQuest}
                </h2>
                <button onClick={() => setShowQuestSelector(false)} className="w-10 h-10 neumorph flex items-center justify-center hover:neumorph-pressed transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {quests.filter(q => !q.completed).length === 0 ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-8 h-8 text-[var(--text-secondary)] opacity-20" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">{t.noQuests}</p>
                  </div>
                ) : (
                  quests.filter(q => !q.completed).map(quest => (
                    <ThemeButton
                      key={quest.id}
                      onClick={() => {
                        setActiveQuestId(quest.id);
                        setShowQuestSelector(false);
                      }}
                      className={cn(
                        "w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between group",
                        activeQuestId === quest.id 
                          ? "bg-[var(--accent-primary)] text-white shadow-lg" 
                          : "bg-[var(--bg-secondary)]/50 hover:bg-[var(--bg-secondary)]"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-black uppercase tracking-tight">{quest.title}</div>
                        <div className={cn(
                          "text-[10px] font-bold uppercase tracking-widest",
                          activeQuestId === quest.id ? "text-white/70" : "text-[var(--text-secondary)]"
                        )}>
                          {quest.subject} • {quest.xpReward} XP
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        "w-5 h-5 transition-transform group-hover:translate-x-1",
                        activeQuestId === quest.id ? "text-white" : "text-[var(--text-secondary)]"
                      )} />
                    </ThemeButton>
                  ))
                )}
              </div>

              <div className="pt-4 border-t border-[var(--border-color)]">
                <button 
                  onClick={() => {
                    setShowQuestSelector(false);
                    setShowAddQuest(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all group"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest">{t.createNew}</span>
                </button>
              </div>
            </ThemeCard>
          </div>
        )}

        {/* Quick Add Quest Modal */}
        {showAddQuest && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddQuest(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <ThemeCard className="relative w-full max-w-md space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <Plus className="w-8 h-8 text-[var(--accent-primary)]" />
                  {t.newQuest}
                </h2>
                <button onClick={() => setShowAddQuest(false)} className="w-10 h-10 neumorph flex items-center justify-center hover:neumorph-pressed transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.questTitle}</label>
                  <ThemeInput 
                    placeholder={language === 'ar' ? t.questPlaceholder : "e.g., Solve 10 Physics Problems"}
                    value={newQuestTitle}
                    onChange={(val) => setNewQuestTitle(val)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.subject}</label>
                  <select 
                    value={newQuestSubject}
                    onChange={(e) => setNewQuestSubject(e.target.value)}
                    className="w-full bg-[var(--bg-secondary)] border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-[var(--accent-primary)]"
                  >
                    {availableSubjects.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <ThemeButton 
                disabled={!newQuestTitle.trim()}
                onClick={() => {
                  const questData = {
                    title: newQuestTitle,
                    subject: newQuestSubject,
                    priority: 'Medium' as const,
                    dueDate: new Date().toISOString(),
                    xpReward: 50
                  };
                  addQuest(questData);
                  setNewQuestTitle('');
                  setShowAddQuest(false);
                  setShowQuestSelector(true);
                }}
                className="w-full py-4 text-xs disabled:opacity-50"
              >
                {t.addQuest}
              </ThemeButton>
            </ThemeCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
