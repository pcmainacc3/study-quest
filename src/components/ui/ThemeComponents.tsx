/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../lib/themes';
import { cn } from '../../lib/utils';

interface ThemeComponentProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const ThemeButton: React.FC<ThemeComponentProps & { variant?: 'primary' | 'secondary' }> = ({ 
  className, 
  children, 
  onClick,
  variant = 'primary' 
}) => {
  const { theme: storeTheme } = useStore();
  const theme = storeTheme?.typography ? storeTheme : THEMES['Aurora Borealis'];
  
  const getVariantStyles = () => {
    switch (theme.componentVariant) {
      case 'glass':
        return "backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 rounded-2xl";
      case 'neon':
        return "bg-black border-2 border-[var(--accent-primary)] shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)] hover:shadow-[0_0_25px_rgba(var(--accent-rgb),0.8)]";
      case 'organic':
        return "rounded-[2rem] bg-[var(--accent-primary)] text-white shadow-lg hover:scale-105";
      case 'digital':
        return "rounded-none border-2 border-[var(--accent-primary)] bg-transparent hover:bg-[var(--accent-primary)] hover:text-black";
      case 'paper':
        return "bg-white border-b-4 border-r-4 border-black hover:translate-x-[2px] hover:translate-y-[2px] hover:border-b-2 hover:border-r-2";
      case 'hologram':
        return "bg-cyan-500/20 border border-cyan-400/50 skew-x-[-12deg] hover:bg-cyan-500/40";
      case 'retro':
        return "bg-white text-black border-4 border-black rounded-none shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
      case 'solid':
        return "bg-[var(--accent-primary)] text-white border-4 border-black rounded-2xl shadow-[4px_4px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
      default:
        return "bg-[var(--accent-primary)] text-white rounded-2xl";
    }
  };

  const getHoverAnimation = () => {
    switch (theme.physics.hoverBehavior) {
      case 'glow':
        return { scale: 1.05, filter: 'brightness(1.2)' };
      case 'glitch':
        return { x: [0, -2, 2, 0], transition: { duration: 0.1, repeat: Infinity } };
      case 'lift':
        return { y: -5, scale: 1.02 };
      case 'ripple':
        return { scale: 1.1 };
      default:
        return { scale: 1.02 };
    }
  };

  return (
    <motion.button
      whileHover={getHoverAnimation()}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "px-6 py-3 font-bold transition-all duration-200",
        getVariantStyles(),
        className
      )}
      style={{
        fontFamily: theme.typography.fontFamily,
        letterSpacing: theme.typography.letterSpacing,
      }}
    >
      {children}
    </motion.button>
  );
};

export const ThemeCard: React.FC<ThemeComponentProps> = ({ className, children }) => {
  const { theme: storeTheme } = useStore();
  const theme = storeTheme?.typography ? storeTheme : THEMES['Aurora Borealis'];

  const getVariantStyles = () => {
    switch (theme.componentVariant) {
      case 'glass':
        return "backdrop-blur-xl bg-white/5 border border-white/10 rounded-[3rem]";
      case 'neon':
        return "bg-black/80 border border-[var(--accent-primary)]/30 rounded-none shadow-[inset_0_0_20px_rgba(var(--accent-rgb),0.1)]";
      case 'organic':
        return "bg-white rounded-[3rem] shadow-xl border-none";
      case 'digital':
        return "bg-black border-2 border-[var(--accent-primary)] rounded-none";
      case 'paper':
        return "bg-[#fdf6e3] border-2 border-[#eee8d5] rounded-sm shadow-md";
      case 'hologram':
        return "bg-cyan-900/10 border border-cyan-500/20 backdrop-blur-sm rounded-lg";
      case 'retro':
        return "bg-black border-4 border-white rounded-none shadow-[8px_8px_0_0_#fff]";
      case 'solid':
        return "bg-[var(--bg-secondary)] rounded-3xl border-4 border-black shadow-[8px_8px_0_0_#000]";
      default:
        return "bg-white rounded-[2rem] shadow-sm";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: theme.physics.duration, ease: theme.physics.easing }}
      className={cn(
        "p-6 overflow-hidden",
        getVariantStyles(),
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const ThemeInput: React.FC<{ 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string;
  className?: string;
  type?: string;
}> = ({ value, onChange, placeholder, className, type = 'text' }) => {
  const { theme: storeTheme } = useStore();
  const theme = storeTheme?.typography ? storeTheme : THEMES['Aurora Borealis'];

  const getVariantStyles = () => {
    switch (theme.componentVariant) {
      case 'glass':
        return "bg-white/5 border border-white/10 rounded-2xl focus:bg-white/10 focus:rounded-[2rem]";
      case 'neon':
        return "bg-transparent border-b-2 border-[var(--accent-primary)] rounded-none focus:shadow-[0_4px_10px_-2px_var(--accent-primary)]";
      case 'digital':
        return "bg-black border-2 border-[var(--accent-primary)] rounded-none focus:bg-[var(--accent-primary)]/10";
      case 'paper':
        return "bg-transparent border-b-2 border-black rounded-none focus:border-b-4";
      case 'hologram':
        return "bg-cyan-500/5 border border-cyan-500/20 rounded-none skew-x-[-12deg] focus:border-cyan-500/50";
      default:
        return "bg-[var(--bg-secondary)] rounded-2xl border-none focus:ring-2 ring-[var(--accent-primary)]";
    }
  };

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full p-4 outline-none transition-all font-bold",
        getVariantStyles(),
        className
      )}
      style={{
        fontFamily: theme.typography.fontFamily,
      }}
    />
  );
};

export const ThemeProgress: React.FC<{ value: number; max: number; className?: string }> = ({ value, max, className }) => {
  const { theme: storeTheme } = useStore();
  const theme = storeTheme?.typography ? storeTheme : THEMES['Aurora Borealis'];
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full h-3 bg-black/10 rounded-full overflow-hidden relative", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full bg-[var(--accent-primary)]"
        style={{
          boxShadow: theme.componentVariant === 'neon' ? '0 0 10px var(--accent-primary)' : 'none'
        }}
      />
      {theme.componentVariant === 'hologram' && (
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-scan" />
      )}
    </div>
  );
};
