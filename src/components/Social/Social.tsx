/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store/useStore';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  limit,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Users, 
  Shield, 
  UserPlus, 
  MessageSquare, 
  Trophy, 
  Zap,
  Star,
  Search,
  Loader2,
  Check
} from 'lucide-react';
import { cn } from '../../lib/utils';

import { ThemeButton, ThemeCard, ThemeInput } from '../ui/ThemeComponents';

export default function Social() {
  const { guild, friends, character, language, addFriend, user } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const t = {
    en: {
      title: 'Social Hub',
      subtitle: 'Connect with fellow students and conquer the BAC together',
      rank: 'Rank',
      level: 'Level',
      guildXp: 'Guild XP',
      chat: 'Guild Chat',
      missions: 'Missions',
      leaderboard: 'Guild Leaderboard',
      activeBuffs: 'Active Buffs',
      friends: 'Friends',
      search: 'Search users by username...',
      studying: 'Studying',
      offline: 'Offline',
      noResults: 'No users found',
      addFriend: 'Add Friend',
      friendAdded: 'Friend Added'
    },
    ar: {
      title: 'المركز الاجتماعي',
      subtitle: 'تواصل مع زملائك الطلاب واجتازوا البكالوريا معاً',
      rank: 'الرتبة',
      level: 'المستوى',
      guildXp: 'خبرة النقابة',
      chat: 'دردشة النقابة',
      missions: 'المهمات',
      leaderboard: 'لوحة المتصدرين',
      activeBuffs: 'المكافآت النشطة',
      friends: 'الأصدقاء',
      search: 'البحث عن مستخدمين...',
      studying: 'يدرس',
      offline: 'غير متصل',
      nightOwl: 'تعزيز بومة الليل',
      nightOwlDesc: '+15% خبرة بعد 10 مساءً',
      focusAura: 'هالة التركيز',
      focusAuraDesc: '+10% مدة التركيز',
      noResults: 'لم يتم العثور على مستخدمين',
      addFriend: 'إضافة صديق',
      friendAdded: 'تمت الإضافة'
    }
  }[language];

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const q = query(
          collection(db, 'profiles'),
          where('username', '>=', searchQuery.toLowerCase()),
          where('username', '<=', searchQuery.toLowerCase() + '\uf8ff'),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs
          .map(doc => doc.data())
          .filter(p => p.uid !== user?.uid && !friends.some(f => f.id === p.uid)); // Don't show self or friends
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchUsers, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, user?.uid]);

  const handleAddFriend = async (profile: any) => {
    await addFriend({
      id: profile.uid,
      name: profile.username,
      level: profile.level || 0,
      status: 'offline',
      lastActive: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
          <Users className="w-10 h-10 text-[var(--accent-primary)]" />
          {t.title}
        </h1>
        <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Guild Section */}
        <div className="lg:col-span-2 space-y-6">
          <ThemeCard className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)]/10 blur-3xl rounded-full -mr-32 -mt-32" />
            
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
              <div className="w-32 h-32 neumorph flex items-center justify-center relative">
                <Shield className="w-16 h-16 text-[var(--accent-primary)] animate-float" />
                <div className="absolute -bottom-2 bg-[var(--accent-primary)] px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {t.rank} #4
                </div>
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <h2 className="text-3xl font-black tracking-tight uppercase">
                    {guild?.name || 'The Calculus Kings'}
                  </h2>
                  <p className="text-[var(--text-secondary)] font-bold uppercase tracking-widest text-[10px]">
                    {guild?.type || 'Subject Masters'} • {t.level} 12
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-[var(--text-secondary)]">{t.guildXp}</span>
                    <span className="text-[var(--accent-primary)]">8,450 / 10,000</span>
                  </div>
                  <div className="xp-bar">
                    <div className="xp-progress w-[84%]" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <ThemeButton className="px-6 py-2 text-[10px]">
                    {t.chat}
                  </ThemeButton>
                  <ThemeButton className="px-6 py-2 text-[10px]">
                    {t.missions}
                  </ThemeButton>
                </div>
              </div>
            </div>
          </ThemeCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ThemeCard className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                {t.leaderboard}
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <ThemeCard key={i} className="flex items-center gap-3 p-3 hover:scale-[1.02] transition-all cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center font-black text-xs">
                      {i}
                    </div>
                    <div className="flex-1 font-bold text-sm">Student_{i}42</div>
                    <div className="text-[var(--accent-primary)] font-black text-xs">2.4k XP</div>
                  </ThemeCard>
                ))}
              </div>
            </ThemeCard>

            <ThemeCard className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                {t.activeBuffs}
              </h3>
              <div className="space-y-3">
                <ThemeCard className="p-3 border-l-4 border-orange-500">
                  <div className="font-black text-xs uppercase">{language === 'ar' ? t.nightOwl : 'Night Owl Boost'}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">{language === 'ar' ? t.nightOwlDesc : '+15% XP after 10 PM'}</div>
                </ThemeCard>
                <ThemeCard className="p-3 border-l-4 border-blue-500">
                  <div className="font-black text-xs uppercase">{language === 'ar' ? t.focusAura : 'Focus Aura'}</div>
                  <div className="text-[10px] text-[var(--text-secondary)]">{language === 'ar' ? t.focusAuraDesc : '+10% Focus duration'}</div>
                </ThemeCard>
              </div>
            </ThemeCard>
          </div>
        </div>

        {/* Friends Section */}
        <div className="space-y-6">
          <ThemeCard className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                {t.friends}
              </h2>
              <ThemeButton className="w-10 h-10 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </ThemeButton>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <ThemeInput 
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
                placeholder={t.search} 
                className="pl-12"
              />
              {isSearching && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[var(--accent-primary)]" />
              )}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {searchResults.length > 0 ? (
                  searchResults.map((profile) => {
                    const isFriend = friends.some(f => f.id === profile.uid);
                    return (
                      <ThemeCard 
                        key={profile.uid}
                        className="flex items-center gap-4 p-3 hover:scale-[1.02] transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden border border-[var(--border-color)]">
                          <img 
                            src={profile.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${profile.username}`} 
                            alt={profile.username}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{profile.username}</div>
                          <div className="text-[9px] text-[var(--text-secondary)] font-black uppercase">{t.level} {profile.level || 0}</div>
                        </div>
                        <ThemeButton 
                          onClick={() => !isFriend && handleAddFriend(profile)}
                          disabled={isFriend}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center transition-all",
                            isFriend ? "text-green-500" : "text-[var(--accent-primary)]"
                          )}
                        >
                          {isFriend ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                        </ThemeButton>
                      </ThemeCard>
                    );
                  })
                ) : searchQuery.length >= 3 && !isSearching ? (
                  <div className="text-center py-8 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                    {t.noResults}
                  </div>
                ) : null}

                {/* Friends List */}
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <ThemeCard 
                      key={friend.id} 
                      className="flex items-center gap-4 p-3 hover:scale-[1.02] transition-all cursor-pointer group"
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden border border-[var(--border-color)]">
                          <img 
                            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${friend.name}`} 
                            alt={friend.name}
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[var(--bg-primary)]",
                          friend.status === 'online' || friend.status === 'studying' ? "bg-green-500" : "bg-gray-500"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{friend.name}</div>
                        <div className="text-[9px] text-[var(--text-secondary)] font-black uppercase">{t.level} {friend.level} • {friend.status === 'studying' ? t.studying : t.offline}</div>
                      </div>
                      <ThemeButton className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-[var(--accent-primary)]" />
                      </ThemeButton>
                    </ThemeCard>
                  ))
                ) : searchQuery.length < 3 && (
                  <div className="text-center py-8 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
                    No friends yet. Search to add!
                  </div>
                )}
              </AnimatePresence>
            </div>
          </ThemeCard>
        </div>

      </div>
    </div>
  );
}
