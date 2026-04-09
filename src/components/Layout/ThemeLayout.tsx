/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../lib/themes';
import { Sidebar, BottomNav } from './Navigation';
import DynamicBackground from '../DynamicBackground';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { ThemeButton } from '../ui/ThemeComponents';

interface ThemeLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

export const ThemeLayout: React.FC<ThemeLayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const { theme: storeTheme } = useStore();
  const theme = storeTheme?.typography ? storeTheme : THEMES['Aurora Borealis'];

  const getLayoutStyles = () => {
    switch (theme.layout) {
      case 'floating':
        return "p-4 md:p-8 lg:p-12";
      case 'hud':
        return "p-2 md:p-4 border-x-2 border-[var(--accent-primary)]/20";
      case 'isometric':
        return "p-0";
      default:
        return "p-4 md:p-8 lg:p-12";
    }
  };

  return (
    <div 
      className={cn(
        "flex min-h-screen text-[var(--text-primary)] relative transition-colors duration-1000",
        theme.layout === 'hud' && "bg-black"
      )}
      style={{
        fontFamily: theme.typography.fontFamily,
        backgroundColor: theme.colors.background,
        color: theme.colors.text
      }}
    >
      {/* Theme-specific ambient elements */}
      <AnimatePresence mode="wait">
        <motion.div
          key={theme.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-0"
        >
          <DynamicBackground />
          {theme.ambientAnimation === 'scan-lines' && (
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
          )}
          {theme.ambientAnimation === 'rain-overlay' && (
            <div className="absolute inset-0 opacity-20 bg-[url('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJ6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6Z3R6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKVUn7iM8FMEU24/giphy.gif')] bg-repeat" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation based on theme layout */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className={cn(
        "flex-1 max-w-7xl mx-auto w-full relative z-10 lg:ml-8",
        getLayoutStyles()
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: theme.physics.duration, ease: theme.physics.easing }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Theme Unique Features */}
      {theme.uniqueFeature === 'System boot animation' && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, delay: 1 }}
          className="fixed inset-0 z-[200] bg-black flex items-center justify-center pointer-events-none"
        >
          <div className="text-cyan-500 font-mono text-sm">
            <div>&gt; SYSTEM INITIALIZING...</div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1 }}
              className="h-1 bg-cyan-500 mt-2" 
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};
