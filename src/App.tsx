/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { THEMES } from './lib/themes';
import OnboardingFlow from './components/Onboarding/OnboardingFlow';
import Dashboard from './components/Dashboard/Dashboard';
import FocusTimer from './components/Focus/FocusTimer';
import QuestLog from './components/Quests/QuestLog';
import Social from './components/Social/Social';
import Planner from './components/Planner/Planner';
import Profile from './components/Profile/Profile';
import { Sidebar, BottomNav } from './components/Layout/Navigation';
import DynamicBackground from './components/DynamicBackground';
import AuthScreen from './components/Auth/AuthScreen';
import FirebaseSync from './components/Auth/FirebaseSync';
import { motion, AnimatePresence } from 'motion/react';

import { ThemeLayout } from './components/Layout/ThemeLayout';

export default function App() {
  const user = useStore(state => state.user);
  const onboarded = useStore(state => state.onboarded);
  const storeTheme = useStore(state => state.theme);
  const theme = storeTheme?.typography ? storeTheme : THEMES['Aurora Borealis'];
  const language = useStore(state => state.language);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', theme.colors.accent);
    root.style.setProperty('--bg-primary', theme.colors.background);
    root.style.setProperty('--bg-secondary', theme.colors.secondary);
    root.style.setProperty('--text-primary', theme.colors.text);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--border-color', theme.colors.border);
    
    // Convert hex to rgb for shadow/opacity use
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0';
    };
    root.style.setProperty('--accent-rgb', hexToRgb(theme.colors.accent));
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  if (!user) {
    return (
      <>
        <FirebaseSync />
        <AuthScreen />
      </>
    );
  }

  if (!onboarded) {
    return (
      <>
        <FirebaseSync />
        <DynamicBackground />
        <OnboardingFlow />
      </>
    );
  }

  return (
    <ThemeLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <FirebaseSync />
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'focus' && <FocusTimer />}
      {activeTab === 'quests' && <QuestLog />}
      {activeTab === 'social' && <Social />}
      {activeTab === 'planner' && <Planner />}
      {activeTab === 'profile' && <Profile />}
    </ThemeLayout>
  );
}

