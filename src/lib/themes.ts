/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThemeDefinition {
  id: string;
  name: string;
  vibe: string;
  layout: 'sidebar' | 'bottom-nav' | 'floating' | 'hud' | 'isometric';
  componentVariant: 'glass' | 'solid' | 'organic' | 'digital' | 'paper' | 'neon' | 'hologram' | 'retro';
  physics: {
    duration: number;
    easing: string;
    hoverBehavior: 'lift' | 'glow' | 'distort' | 'ripple' | 'glitch' | 'tilt';
  };
  typography: {
    fontFamily: string;
    headingWeight: string;
    baseWeight: string;
    letterSpacing: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  soundPack: string;
  ambientAnimation: string;
  uniqueFeature: string;
}

export const THEMES: Record<string, ThemeDefinition> = {
  'Aurora Borealis': {
    id: 'aurora',
    name: 'Aurora Borealis',
    vibe: 'Scientific, calm, expansive',
    layout: 'floating',
    componentVariant: 'glass',
    physics: {
      duration: 0.3,
      easing: 'easeOut',
      hoverBehavior: 'glow'
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingWeight: '900',
      baseWeight: '500',
      letterSpacing: '0.1em'
    },
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#2dd4bf',
      background: '#020617',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: 'rgba(45, 212, 191, 0.2)'
    },
    soundPack: 'aurora',
    ambientAnimation: 'aurora-waves',
    uniqueFeature: 'Real-time aurora simulation'
  },
  'Neon Noir': {
    id: 'neon-noir',
    name: 'Neon Noir',
    vibe: 'Mystery, tension, cinematic',
    layout: 'sidebar',
    componentVariant: 'neon',
    physics: {
      duration: 0.1,
      easing: 'linear',
      hoverBehavior: 'glitch'
    },
    typography: {
      fontFamily: '"JetBrains Mono", monospace',
      headingWeight: '700',
      baseWeight: '400',
      letterSpacing: '0'
    },
    colors: {
      primary: '#000000',
      secondary: '#111111',
      accent: '#ff0055',
      background: '#050505',
      text: '#ffffff',
      textSecondary: '#666666',
      border: '#333333'
    },
    soundPack: 'noir',
    ambientAnimation: 'rain-overlay',
    uniqueFeature: 'Case closed animations'
  },
  'Koi Pond': {
    id: 'koi-pond',
    name: 'Koi Pond',
    vibe: 'Peaceful, organic, meditative',
    layout: 'floating',
    componentVariant: 'organic',
    physics: {
      duration: 0.5,
      easing: 'easeInOut',
      hoverBehavior: 'ripple'
    },
    typography: {
      fontFamily: '"Outfit", sans-serif',
      headingWeight: '500',
      baseWeight: '400',
      letterSpacing: '0.05em'
    },
    colors: {
      primary: '#f0fdf4',
      secondary: '#dcfce7',
      accent: '#f97316',
      background: '#ecfdf5',
      text: '#064e3b',
      textSecondary: '#065f46',
      border: 'rgba(249, 115, 22, 0.2)'
    },
    soundPack: 'zen',
    ambientAnimation: 'water-ripples',
    uniqueFeature: 'Koi follow cursor'
  },
  'Lo-Fi Desk': {
    id: 'lo-fi',
    name: 'Lo-Fi Desk',
    vibe: 'Cozy, nostalgic, productive',
    layout: 'isometric',
    componentVariant: 'paper',
    physics: {
      duration: 0.4,
      easing: 'easeOut',
      hoverBehavior: 'lift'
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingWeight: '700',
      baseWeight: '500',
      letterSpacing: '0'
    },
    colors: {
      primary: '#fef3c7',
      secondary: '#fde68a',
      accent: '#d97706',
      background: '#fffbeb',
      text: '#451a03',
      textSecondary: '#78350f',
      border: '#d97706'
    },
    soundPack: 'lofi',
    ambientAnimation: 'day-night-cycle',
    uniqueFeature: 'Cat on desk'
  },
  'Hologram Station': {
    id: 'hologram',
    name: 'Hologram Station',
    vibe: 'Futuristic, clinical, high-tech',
    layout: 'hud',
    componentVariant: 'hologram',
    physics: {
      duration: 0.05,
      easing: 'linear',
      hoverBehavior: 'glitch'
    },
    typography: {
      fontFamily: '"JetBrains Mono", monospace',
      headingWeight: '800',
      baseWeight: '500',
      letterSpacing: '0.2em'
    },
    colors: {
      primary: '#000000',
      secondary: '#001122',
      accent: '#00ffff',
      background: '#000810',
      text: '#00ffff',
      textSecondary: '#008888',
      border: 'rgba(0, 255, 255, 0.3)'
    },
    soundPack: 'scifi',
    ambientAnimation: 'scan-lines',
    uniqueFeature: 'System boot animation'
  },
  'Morning Coffee': {
    id: 'coffee',
    name: 'Morning Coffee',
    vibe: 'Warm, literary, artisanal',
    layout: 'sidebar',
    componentVariant: 'paper',
    physics: {
      duration: 0.4,
      easing: 'easeOut',
      hoverBehavior: 'lift'
    },
    typography: {
      fontFamily: '"Playfair Display", serif',
      headingWeight: '700',
      baseWeight: '400',
      letterSpacing: '0'
    },
    colors: {
      primary: '#fafaf9',
      secondary: '#f5f5f4',
      accent: '#78350f',
      background: '#fffaf3',
      text: '#1c1917',
      textSecondary: '#44403c',
      border: '#d6d3d1'
    },
    soundPack: 'cafe',
    ambientAnimation: 'steam-swirls',
    uniqueFeature: 'Steam reacts to scroll'
  },
  'Synthwave Sunset': {
    id: 'synthwave',
    name: 'Synthwave Sunset',
    vibe: 'Nostalgic, energetic, retro-futuristic',
    layout: 'sidebar',
    componentVariant: 'neon',
    physics: {
      duration: 0.2,
      easing: 'backOut',
      hoverBehavior: 'glow'
    },
    typography: {
      fontFamily: '"Space Grotesk", sans-serif',
      headingWeight: '900',
      baseWeight: '500',
      letterSpacing: '0.1em'
    },
    colors: {
      primary: '#2e1065',
      secondary: '#4c1d95',
      accent: '#f472b6',
      background: '#0f172a',
      text: '#fdf2f8',
      textSecondary: '#f9a8d4',
      border: '#f472b6'
    },
    soundPack: 'synth',
    ambientAnimation: 'grid-floor',
    uniqueFeature: 'Grid moves on scroll'
  },
  'Underwater Depth': {
    id: 'underwater',
    name: 'Underwater Depth',
    vibe: 'Mysterious, pressurized, bioluminescent',
    layout: 'hud',
    componentVariant: 'glass',
    physics: {
      duration: 0.6,
      easing: 'easeInOut',
      hoverBehavior: 'distort'
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingWeight: '700',
      baseWeight: '400',
      letterSpacing: '0.05em'
    },
    colors: {
      primary: '#082f49',
      secondary: '#0c4a6e',
      accent: '#38bdf8',
      background: '#020617',
      text: '#e0f2fe',
      textSecondary: '#7dd3fc',
      border: 'rgba(56, 189, 248, 0.2)'
    },
    soundPack: 'submarine',
    ambientAnimation: 'water-distortion',
    uniqueFeature: 'Bioluminescent creatures'
  },
  'Paper Craft': {
    id: 'paper-craft',
    name: 'Paper Craft',
    vibe: 'Handmade, delicate, artistic',
    layout: 'floating',
    componentVariant: 'paper',
    physics: {
      duration: 0.35,
      easing: 'backOut',
      hoverBehavior: 'lift'
    },
    typography: {
      fontFamily: '"Outfit", sans-serif',
      headingWeight: '600',
      baseWeight: '400',
      letterSpacing: '0'
    },
    colors: {
      primary: '#ffffff',
      secondary: '#f3f4f6',
      accent: '#3b82f6',
      background: '#f9fafb',
      text: '#111827',
      textSecondary: '#4b5563',
      border: '#e5e7eb'
    },
    soundPack: 'paper',
    ambientAnimation: 'layered-depth',
    uniqueFeature: 'Elements fold when dismissed'
  },
  'Isometric City': {
    id: 'city',
    name: 'Isometric City',
    vibe: 'Constructive, architectural, rewarding',
    layout: 'isometric',
    componentVariant: 'solid',
    physics: {
      duration: 0.25,
      easing: 'easeOut',
      hoverBehavior: 'tilt'
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingWeight: '800',
      baseWeight: '500',
      letterSpacing: '0'
    },
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#fbbf24',
      background: '#eff6ff',
      text: '#1e3a8a',
      textSecondary: '#1d4ed8',
      border: '#bfdbfe'
    },
    soundPack: 'city',
    ambientAnimation: 'city-growth',
    uniqueFeature: 'City grows as you progress'
  },
  'Magma Chamber': {
    id: 'magma',
    name: 'Magma Chamber',
    vibe: 'Intense, powerful, transformative',
    layout: 'sidebar',
    componentVariant: 'solid',
    physics: {
      duration: 0.15,
      easing: 'easeIn',
      hoverBehavior: 'glow'
    },
    typography: {
      fontFamily: '"Space Grotesk", sans-serif',
      headingWeight: '900',
      baseWeight: '600',
      letterSpacing: '0.05em'
    },
    colors: {
      primary: '#450a0a',
      secondary: '#7f1d1d',
      accent: '#f97316',
      background: '#0c0a09',
      text: '#fef2f2',
      textSecondary: '#fca5a5',
      border: '#f97316'
    },
    soundPack: 'forge',
    ambientAnimation: 'heat-shimmer',
    uniqueFeature: 'Heat level affects color grading'
  },
  'Cloud Nine': {
    id: 'clouds',
    name: 'Cloud Nine',
    vibe: 'Dreamy, weightless, aspirational',
    layout: 'floating',
    componentVariant: 'organic',
    physics: {
      duration: 0.5,
      easing: 'easeInOut',
      hoverBehavior: 'lift'
    },
    typography: {
      fontFamily: '"Outfit", sans-serif',
      headingWeight: '500',
      baseWeight: '400',
      letterSpacing: '0.05em'
    },
    colors: {
      primary: '#f0f9ff',
      secondary: '#e0f2fe',
      accent: '#38bdf8',
      background: '#f8fafc',
      text: '#0c4a6e',
      textSecondary: '#0369a1',
      border: 'rgba(56, 189, 248, 0.2)'
    },
    soundPack: 'sky',
    ambientAnimation: 'floating-islands',
    uniqueFeature: 'Rainbows on streaks'
  },
  'Vaporwave Temple': {
    id: 'vaporwave',
    name: 'Vaporwave Temple',
    vibe: 'Nostalgic, surreal, anachronistic',
    layout: 'floating',
    componentVariant: 'glass',
    physics: {
      duration: 0.4,
      easing: 'easeInOut',
      hoverBehavior: 'glitch'
    },
    typography: {
      fontFamily: '"Space Grotesk", sans-serif',
      headingWeight: '700',
      baseWeight: '400',
      letterSpacing: '0.2em'
    },
    colors: {
      primary: '#ff71ce',
      secondary: '#01cdfe',
      accent: '#b967ff',
      background: '#fffb96',
      text: '#05ffa1',
      textSecondary: '#01cdfe',
      border: '#ff71ce'
    },
    soundPack: 'vaporwave',
    ambientAnimation: 'glitch-events',
    uniqueFeature: '90s computer interfaces'
  },
  'Forest Canopy': {
    id: 'forest',
    name: 'Forest Canopy',
    vibe: 'Natural, hidden, adventurous',
    layout: 'sidebar',
    componentVariant: 'organic',
    physics: {
      duration: 0.35,
      easing: 'easeOut',
      hoverBehavior: 'tilt'
    },
    typography: {
      fontFamily: '"Outfit", sans-serif',
      headingWeight: '700',
      baseWeight: '500',
      letterSpacing: '0'
    },
    colors: {
      primary: '#064e3b',
      secondary: '#065f46',
      accent: '#10b981',
      background: '#f0fdf4',
      text: '#022c22',
      textSecondary: '#064e3b',
      border: '#10b981'
    },
    soundPack: 'forest',
    ambientAnimation: 'swaying-branches',
    uniqueFeature: 'Season changes on date'
  },
  'Quantum Field': {
    id: 'quantum',
    name: 'Quantum Field',
    vibe: 'Abstract, probabilistic, mind-bending',
    layout: 'hud',
    componentVariant: 'digital',
    physics: {
      duration: 0.2,
      easing: 'linear',
      hoverBehavior: 'distort'
    },
    typography: {
      fontFamily: '"JetBrains Mono", monospace',
      headingWeight: '500',
      baseWeight: '400',
      letterSpacing: '0.1em'
    },
    colors: {
      primary: '#000000',
      secondary: '#111111',
      accent: '#8b5cf6',
      background: '#050505',
      text: '#ffffff',
      textSecondary: '#a78bfa',
      border: '#8b5cf6'
    },
    soundPack: 'quantum',
    ambientAnimation: 'probability-clouds',
    uniqueFeature: 'Schrödinger\'s cat'
  },
  'Ink in Water': {
    id: 'ink',
    name: 'Ink in Water',
    vibe: 'Artistic, flowing, unpredictable',
    layout: 'floating',
    componentVariant: 'organic',
    physics: {
      duration: 0.8,
      easing: 'easeInOut',
      hoverBehavior: 'ripple'
    },
    typography: {
      fontFamily: '"Playfair Display", serif',
      headingWeight: '400',
      baseWeight: '400',
      letterSpacing: '0.05em'
    },
    colors: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      accent: '#111827',
      background: '#ffffff',
      text: '#111827',
      textSecondary: '#4b5563',
      border: '#e5e7eb'
    },
    soundPack: 'ink',
    ambientAnimation: 'fluid-simulation',
    uniqueFeature: 'Real-time fluid art'
  },
  'Retro Arcade': {
    id: 'arcade',
    name: 'Retro Arcade',
    vibe: 'Playful, nostalgic, game-like',
    layout: 'hud',
    componentVariant: 'retro',
    physics: {
      duration: 0.1,
      easing: 'linear',
      hoverBehavior: 'glitch'
    },
    typography: {
      fontFamily: '"Press Start 2P", cursive',
      headingWeight: '400',
      baseWeight: '400',
      letterSpacing: '0'
    },
    colors: {
      primary: '#000000',
      secondary: '#111111',
      accent: '#4ade80',
      background: '#000000',
      text: '#4ade80',
      textSecondary: '#22c55e',
      border: '#4ade80'
    },
    soundPack: 'arcade',
    ambientAnimation: 'scan-lines',
    uniqueFeature: 'Insert coin to start'
  },
  'Zen Garden 2.0': {
    id: 'zen-2',
    name: 'Zen Garden 2.0',
    vibe: 'Meditative, precise, eternal',
    layout: 'floating',
    componentVariant: 'organic',
    physics: {
      duration: 0.5,
      easing: 'easeInOut',
      hoverBehavior: 'ripple'
    },
    typography: {
      fontFamily: '"Outfit", sans-serif',
      headingWeight: '400',
      baseWeight: '400',
      letterSpacing: '0.1em'
    },
    colors: {
      primary: '#f5f5f4',
      secondary: '#e7e5e4',
      accent: '#44403c',
      background: '#fafaf9',
      text: '#1c1917',
      textSecondary: '#57534e',
      border: '#d6d3d1'
    },
    soundPack: 'zen',
    ambientAnimation: 'raked-sand',
    uniqueFeature: 'Persisting raking patterns'
  },
  'Space Elevator': {
    id: 'space-elevator',
    name: 'Space Elevator',
    vibe: 'Aspirational, progressive, infinite',
    layout: 'sidebar',
    componentVariant: 'hologram',
    physics: {
      duration: 0.3,
      easing: 'easeOut',
      hoverBehavior: 'lift'
    },
    typography: {
      fontFamily: '"Inter", sans-serif',
      headingWeight: '900',
      baseWeight: '500',
      letterSpacing: '0.05em'
    },
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#38bdf8',
      background: '#020617',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: 'rgba(56, 189, 248, 0.3)'
    },
    soundPack: 'space',
    ambientAnimation: 'ascending-stars',
    uniqueFeature: 'Altitude = your level'
  },
  'Alchemy Lab': {
    id: 'alchemy',
    name: 'Alchemy Lab',
    vibe: 'Mysterious, experimental, magical',
    layout: 'sidebar',
    componentVariant: 'organic',
    physics: {
      duration: 0.25,
      easing: 'backOut',
      hoverBehavior: 'glow'
    },
    typography: {
      fontFamily: '"Playfair Display", serif',
      headingWeight: '700',
      baseWeight: '500',
      letterSpacing: '0'
    },
    colors: {
      primary: '#2d1a12',
      secondary: '#451a03',
      accent: '#f59e0b',
      background: '#1c1917',
      text: '#fef3c7',
      textSecondary: '#d97706',
      border: '#f59e0b'
    },
    soundPack: 'alchemy',
    ambientAnimation: 'bubbling-flasks',
    uniqueFeature: 'Mix flasks by dragging'
  }
};

export const DEFAULT_THEME = THEMES['Aurora Borealis'];
