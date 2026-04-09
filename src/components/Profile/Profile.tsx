/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  Share2, 
  Settings, 
  Download,
  BookOpen,
  Zap,
  Star,
  ChevronRight,
  Camera,
  X,
  LogOut
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../../lib/utils';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

import { ThemeButton, ThemeCard } from '../ui/ThemeComponents';

export default function Profile() {
  const { character, sessions, streak, achievements, selectedStream, updateCharacter, language, theme: currentTheme, setTheme, setLanguage, logout, quests } = useStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);

  const THEMES_LIST = [
    { id: 'aurora', name: 'Aurora Borealis' },
    { id: 'neon-noir', name: 'Neon Noir' },
    { id: 'koi-pond', name: 'Koi Pond' },
    { id: 'lo-fi', name: 'Lo-Fi Desk' },
    { id: 'hologram', name: 'Hologram Station' },
    { id: 'coffee', name: 'Morning Coffee' },
    { id: 'synthwave', name: 'Synthwave Sunset' },
    { id: 'underwater', name: 'Underwater Depth' },
    { id: 'paper-craft', name: 'Paper Craft' },
    { id: 'city', name: 'Isometric City' },
    { id: 'magma', name: 'Magma Chamber' },
    { id: 'clouds', name: 'Cloud Nine' },
    { id: 'vaporwave', name: 'Vaporwave Temple' },
    { id: 'forest', name: 'Forest Canopy' },
    { id: 'quantum', name: 'Quantum Field' },
    { id: 'ink', name: 'Ink in Water' },
    { id: 'arcade', name: 'Retro Arcade' },
    { id: 'zen-2', name: 'Zen Garden 2.0' },
    { id: 'space-elevator', name: 'Space Elevator' },
    { id: 'alchemy', name: 'Alchemy Lab' }
  ];

  const t = {
    en: {
      dayStreak: 'Day Streak',
      settings: 'Settings',
      share: 'Share',
      top: 'Top',
      totalXp: 'Total XP Earned',
      studyHours: 'Study Hours',
      questsDone: 'Quests Done',
      successRate: 'Success Rate',
      weeklyActivity: 'Weekly Activity',
      last7Days: 'Last 7 Days',
      subjectMastery: 'Subject Mastery',
      focusHeatmap: 'Focus Heatmap',
      peakHours: 'Peak Hours',
      less: 'Less',
      more: 'More',
      bacReadiness: 'BAC Readiness',
      syllabusMastery: 'Syllabus Mastery',
      daysToExam: 'Days to Exam',
      days: 'Days',
      trophyCase: 'Trophy Case',
      viewAll: 'View All',
      recentSessions: 'Recent Sessions',
      noSessions: 'No sessions recorded yet. Start studying!',
      exportPdf: 'Export PDF Report',
      backupData: 'Backup Data',
      themes: 'Themes',
      language: 'Language',
      close: 'Close',
      logout: 'Logout'
    },
    ar: {
      dayStreak: 'أيام متتالية',
      settings: 'الإعدادات',
      share: 'مشاركة',
      top: 'أفضل',
      totalXp: 'إجمالي الخبرة المكتسبة',
      studyHours: 'ساعات الدراسة',
      questsDone: 'المهام المنجزة',
      successRate: 'معدل النجاح',
      weeklyActivity: 'النشاط الأسبوعي',
      last7Days: 'آخر 7 أيام',
      subjectMastery: 'إتقان المواد',
      focusHeatmap: 'خريطة التركيز',
      peakHours: 'ساعات الذروة',
      less: 'أقل',
      more: 'أكثر',
      bacReadiness: 'جاهزية البكالوريا',
      syllabusMastery: 'إتقان المنهج',
      daysToExam: 'أيام حتى الامتحان',
      days: 'أيام',
      trophyCase: 'خزانة الكؤوس',
      viewAll: 'عرض الكل',
      recentSessions: 'الجلسات الأخيرة',
      noSessions: 'لا توجد جلسات مسجلة بعد. ابدأ الدراسة!',
      exportPdf: 'تصدير تقرير PDF',
      backupData: 'نسخ احتياطي للبيانات',
      themes: 'المظاهر',
      language: 'اللغة',
      close: 'إغلاق',
      logout: 'تسجيل الخروج'
    }
  }[language];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCharacter({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Derived Stats
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const questsCompleted = quests.filter(q => q.completed).length;
  const successRate = quests.length > 0 ? Math.round((questsCompleted / quests.length) * 100) : 0;

  // Chart Data
  const weeklyData = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 3.8 },
    { name: 'Wed', hours: 1.2 },
    { name: 'Thu', hours: 4.5 },
    { name: 'Fri', hours: 3.0 },
    { name: 'Sat', hours: 5.2 },
    { name: 'Sun', hours: 4.0 },
  ];

  const subjectData = [
    { name: 'Math', hours: 12, color: '#3b82f6' },
    { name: 'Physics', hours: 8, color: '#6366f1' },
    { name: 'Arabic', hours: 5, color: '#ef4444' },
    { name: 'Phil', hours: 4, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8 pb-24 lg:pb-8">
      {/* Header Section */}
      <ThemeCard className="p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-primary)]/10 blur-3xl rounded-full -mr-48 -mt-48" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <div className="w-40 h-40 rounded-full neumorph flex items-center justify-center p-2 overflow-hidden bg-[var(--bg-secondary)]">
              {character?.avatarUrl ? (
                <img 
                  src={character.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-5xl font-black">
                  {character?.name?.[0] || 'S'}
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-2 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[var(--bg-secondary)] rounded-full neumorph flex items-center justify-center">
              <span className="text-xs font-black text-[var(--accent-primary)]">Lvl {character?.level}</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase">{character?.name}</h1>
              <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-xs">
                {character?.origin} • {selectedStream}
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-black text-xs uppercase tracking-widest">
                <Flame className="w-4 h-4 animate-bounce" />
                {streak.current} {t.dayStreak}
              </div>
              <ThemeButton 
                onClick={() => setShowSettingsModal(true)}
                className="px-6 py-2 flex items-center gap-2 text-xs"
              >
                <Settings className="w-4 h-4" />
                {t.settings}
              </ThemeButton>
              <ThemeButton 
                onClick={handleLogout}
                className="px-6 py-2 flex items-center gap-2 text-xs text-red-500"
              >
                <LogOut className="w-4 h-4" />
                {t.logout}
              </ThemeButton>
              <ThemeButton className="px-6 py-2 flex items-center gap-2 text-xs">
                <Share2 className="w-4 h-4" />
                {t.share}
              </ThemeButton>
            </div>
          </div>
        </div>
      </ThemeCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Core Metrics */}
        <ThemeCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.top} 5%</span>
          </div>
          <div>
            <div className="text-3xl font-black">{character?.xp}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.totalXp}</div>
          </div>
        </ThemeCard>

        <ThemeCard className="p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-3xl font-black">{totalHours}h</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.studyHours}</div>
          </div>
        </ThemeCard>

        <ThemeCard className="p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-3xl font-black">{questsCompleted}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.questsDone}</div>
          </div>
        </ThemeCard>

        <ThemeCard className="p-6 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-3xl font-black">{successRate}%</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.successRate}</div>
          </div>
        </ThemeCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Activity */}
        <ThemeCard className="lg:col-span-2 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[var(--accent-primary)]" />
              {t.weeklyActivity}
            </h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              {t.last7Days}
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 'bold' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 'bold' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-secondary)', 
                    border: 'none', 
                    borderRadius: '1rem',
                    boxShadow: 'var(--neumorph-shadow-light)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="var(--accent-primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorHours)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ThemeCard>

        {/* Subject Mastery */}
        <ThemeCard className="p-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--accent-primary)]" />
            {t.subjectMastery}
          </h3>
          
          <div className="space-y-6">
            {subjectData.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span>{subject.name}</span>
                  <span className="text-[var(--text-secondary)]">{subject.hours}h</span>
                </div>
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(subject.hours / 15) * 100}%` }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ThemeCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productivity Heatmap */}
        <ThemeCard className="lg:col-span-2 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--accent-primary)]" />
              {t.focusHeatmap}
            </h3>
            <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              {t.peakHours}: 10AM - 2PM
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 28 }).map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "aspect-square rounded-md transition-all hover:scale-110 cursor-help",
                  i % 5 === 0 ? "bg-[var(--accent-primary)]" : 
                  i % 3 === 0 ? "bg-[var(--accent-primary)]/60" : 
                  i % 2 === 0 ? "bg-[var(--accent-primary)]/30" : "bg-[var(--bg-secondary)]"
                )}
                title={`Activity level: ${i % 5 === 0 ? 'High' : 'Low'}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
            <span>{t.less}</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-sm bg-[var(--bg-secondary)]" />
              <div className="w-2 h-2 rounded-sm bg-[var(--accent-primary)]/30" />
              <div className="w-2 h-2 rounded-sm bg-[var(--accent-primary)]/60" />
              <div className="w-2 h-2 rounded-sm bg-[var(--accent-primary)]" />
            </div>
            <span>{t.more}</span>
          </div>
        </ThemeCard>

        {/* BAC Progress */}
        <ThemeCard className="p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-2xl rounded-full -mr-16 -mt-16" />
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            {t.bacReadiness}
          </h3>
          
          <div className="space-y-6 relative z-10">
            <div className="text-center">
              <div className="text-5xl font-black text-orange-500">72%</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mt-1">{t.syllabusMastery}</div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span>{t.daysToExam}</span>
                <span className="text-orange-500">42 {t.days}</span>
              </div>
              <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
              <p className="text-[10px] font-bold text-orange-200/80 leading-relaxed italic">
                "You're ahead of 82% of students in the {selectedStream} stream. Keep this pace to hit 90% by May."
              </p>
            </div>
          </div>
        </ThemeCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Achievements */}
        <ThemeCard className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--accent-primary)]" />
              {t.trophyCase}
            </h3>
            <ThemeButton 
              variant="ghost"
              className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-primary)] hover:underline"
            >
              {t.viewAll}
            </ThemeButton>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="group relative">
                <div className={cn(
                  "aspect-square rounded-2xl neumorph flex items-center justify-center transition-all group-hover:scale-110",
                  achievement.progress === 100 ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]" : "opacity-40 grayscale"
                )}>
                  <Star className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="bg-[var(--bg-secondary)] p-2 rounded-lg shadow-xl border border-[var(--border-color)]">
                    <div className="text-[8px] font-black uppercase tracking-tighter">{achievement.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ThemeCard>

        {/* Recent Activity */}
        <ThemeCard className="lg:col-span-2 p-8 space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--accent-primary)]" />
            {t.recentSessions}
          </h3>
          
          <div className="space-y-4">
            {sessions.slice(-3).reverse().map((session) => (
              <ThemeCard key={session.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[var(--text-secondary)]" />
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest">{session.subject}</div>
                    <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                      {new Date(session.timestamp).toLocaleDateString()} • {session.duration}m
                    </div>
                  </div>
                </div>
                <div className="text-[var(--accent-primary)] font-black text-xs">
                  +{session.xpEarned} XP
                </div>
              </ThemeCard>
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-8 text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">
                {t.noSessions}
              </div>
            )}
          </div>
        </ThemeCard>
      </div>

      {/* Export & Backup */}
      <div className="flex flex-wrap gap-4">
        <ThemeButton className="px-8 py-4 flex items-center gap-3 text-xs">
          <Download className="w-5 h-5" />
          {t.exportPdf}
        </ThemeButton>
        <ThemeButton className="px-8 py-4 flex items-center gap-3 text-xs">
          <Share2 className="w-5 h-5" />
          {t.backupData}
        </ThemeButton>
      </div>

      {/* Settings Modal (Mobile Friendly) */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettingsModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <ThemeCard className="relative w-full max-w-lg space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                  <Settings className="w-8 h-8 text-[var(--accent-primary)]" />
                  {t.settings}
                </h2>
                <ThemeButton 
                  onClick={() => setShowSettingsModal(false)} 
                  className="w-10 h-10 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </ThemeButton>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                {/* Language */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.language}</h3>
                  <div className="flex gap-4">
                    <ThemeButton 
                      onClick={() => setLanguage('en')}
                      className={cn(
                        "flex-1 py-4 text-xs",
                        language === 'en' ? "bg-[var(--accent-primary)] text-white" : ""
                      )}
                    >
                      English
                    </ThemeButton>
                    <ThemeButton 
                      onClick={() => setLanguage('ar')}
                      className={cn(
                        "flex-1 py-4 text-xs",
                        language === 'ar' ? "bg-[var(--accent-primary)] text-white" : ""
                      )}
                    >
                      العربية
                    </ThemeButton>
                  </div>
                </div>

                {/* Themes */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">{t.themes}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {THEMES_LIST.map((theme) => (
                      <ThemeButton
                        key={theme.id}
                        onClick={() => setTheme(theme.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 text-[10px]",
                          currentTheme.id === theme.id 
                            ? "bg-[var(--accent-primary)] text-white shadow-lg" 
                            : "text-[var(--text-secondary)]"
                        )}
                      >
                        {theme.name}
                      </ThemeButton>
                    ))}
                  </div>
                </div>
              </div>

              <ThemeButton 
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-4 text-xs"
              >
                {t.close}
              </ThemeButton>
            </ThemeCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
