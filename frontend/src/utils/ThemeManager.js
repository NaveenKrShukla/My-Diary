export const BUILT_IN_THEMES = [
  {
    _id: 'theme-light',
    name: 'Light',
    description: 'Clean light paper theme with warm undertones',
    colors: {
      primary: '#7c3aed',
      secondary: '#4f46e5',
      background: '#fbfaf8',
      surface: '#ffffff',
      text: '#1a1f36',
      accent: '#d97706',
      gradient: ['#7c3aed', '#4f46e5']
    },
    typography: {
      fontFamily: {
        headings: "'Sahitya', 'Lora', Georgia, serif",
        body: "'Lora', Georgia, serif"
      },
      sizes: { heading1: 48, heading2: 36, body: 16 }
    },
    animations: {
      pageFlipSpeed: 0.6,
      scrollAnimationSpeed: 0.3,
      enableLighting: false,
      lightingIntensity: 0
    },
    isActive: true
  },
  {
    _id: 'theme-dark',
    name: 'Dark',
    description: 'Premium dark theme with purple accents',
    colors: {
      primary: '#8b5cf6',
      secondary: '#3b82f6',
      background: '#0f0f0f',
      surface: '#1a1a1a',
      text: '#e8e8e8',
      accent: '#f59e0b',
      gradient: ['#8b5cf6', '#3b82f6']
    },
    typography: {
      fontFamily: {
        headings: "'Sahitya', 'Lora', Georgia, serif",
        body: "'Lora', Georgia, serif"
      },
      sizes: { heading1: 48, heading2: 36, body: 16 }
    },
    animations: {
      pageFlipSpeed: 0.6,
      scrollAnimationSpeed: 0.3,
      enableLighting: true,
      lightingIntensity: 1.0
    },
    isActive: true
  },
  {
    _id: 'theme-zen',
    name: 'Zen',
    description: 'Calm and peaceful light green theme',
    colors: {
      primary: '#10b981',
      secondary: '#06b6d4',
      background: '#f0fdf4',
      surface: '#e0f9f7',
      text: '#1f2937',
      accent: '#6d28d9',
      gradient: ['#10b981', '#06b6d4']
    },
    typography: {
      fontFamily: {
        headings: "'Sahitya', 'Lora', Georgia, serif",
        body: "'Lora', Georgia, serif"
      },
      sizes: { heading1: 48, heading2: 36, body: 16 }
    },
    animations: {
      pageFlipSpeed: 0.8,
      scrollAnimationSpeed: 0.4,
      enableLighting: true,
      lightingIntensity: 0.6
    },
    isActive: true
  },
  {
    _id: 'theme-cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon pink and bright cyan retro theme',
    colors: {
      primary: '#ec4899',
      secondary: '#06b6d4',
      background: '#0a0e27',
      surface: '#16213e',
      text: '#f0f0f0',
      accent: '#ffed4e',
      gradient: ['#ec4899', '#06b6d4']
    },
    typography: {
      fontFamily: {
        headings: "'JetBrains Mono', Courier, monospace",
        body: "Inter, system-ui, sans-serif"
      },
      sizes: { heading1: 48, heading2: 36, body: 16 }
    },
    animations: {
      pageFlipSpeed: 0.4,
      scrollAnimationSpeed: 0.2,
      enableLighting: true,
      lightingIntensity: 1.5
    },
    isActive: true
  },
  {
    _id: 'theme-vintage',
    name: 'Vintage',
    description: 'Warm sepia theme like aged paper',
    colors: {
      primary: '#d4844c',
      secondary: '#a67c52',
      background: '#fcf6e8',
      surface: '#f5e9d3',
      text: '#2c2416',
      accent: '#b45309',
      gradient: ['#d4844c', '#a67c52']
    },
    typography: {
      fontFamily: {
        headings: "'Sahitya', 'Lora', Georgia, serif",
        body: "'Lora', Georgia, serif"
      },
      sizes: { heading1: 48, heading2: 36, body: 16 }
    },
    animations: {
      pageFlipSpeed: 1.0,
      scrollAnimationSpeed: 0.5,
      enableLighting: true,
      lightingIntensity: 0.8
    },
    isActive: true
  },
  {
    _id: 'theme-aurora',
    name: 'Aurora',
    description: 'Neon aurora cyan and magenta theme',
    colors: {
      primary: '#00d9ff',
      secondary: '#ff006e',
      background: '#0a0f2c',
      surface: '#1a1f4a',
      text: '#e0f4ff',
      accent: '#ffbe0b',
      gradient: ['#00d9ff', '#ff006e']
    },
    typography: {
      fontFamily: {
        headings: "'Sahitya', 'Lora', Georgia, serif",
        body: "'Lora', Georgia, serif"
      },
      sizes: { heading1: 48, heading2: 36, body: 16 }
    },
    animations: {
      pageFlipSpeed: 0.6,
      scrollAnimationSpeed: 0.3,
      enableLighting: true,
      lightingIntensity: 1.2
    },
    isActive: true
  }
];

export const applyTheme = (theme) => {
  const root = document.documentElement;

  // Clear existing theme classes
  root.classList.remove(
    'theme-light',
    'theme-dark',
    'theme-zen',
    'theme-cyberpunk',
    'theme-vintage',
    'theme-aurora',
    'theme-custom'
  );

  let activeTheme = null;

  if (typeof theme === 'string') {
    // If it's a slug, load from built-in themes
    activeTheme = BUILT_IN_THEMES.find(t => t._id === `theme-${theme}` || t.name.toLowerCase() === theme.toLowerCase());
    
    if (activeTheme) {
      root.classList.add(`theme-${activeTheme.name.toLowerCase()}`);
    } else {
      // Fallback to dark
      activeTheme = BUILT_IN_THEMES[0];
      root.classList.add('theme-dark');
    }
  } else if (theme && typeof theme === 'object') {
    // It's a custom theme object
    activeTheme = theme;
    root.classList.add('theme-custom');
  }

  if (!activeTheme) return;

  // Set colors
  if (activeTheme.colors) {
    root.style.setProperty('--color-primary', activeTheme.colors.primary);
    root.style.setProperty('--color-secondary', activeTheme.colors.secondary);
    root.style.setProperty('--color-background', activeTheme.colors.background);
    root.style.setProperty('--color-surface', activeTheme.colors.surface || '#1a1a1a');
    root.style.setProperty('--color-text-primary', activeTheme.colors.text);
    root.style.setProperty('--color-accent', activeTheme.colors.accent);
    
    if (activeTheme.colors.gradient && activeTheme.colors.gradient.length >= 2) {
      root.style.setProperty('--color-gradient-start', activeTheme.colors.gradient[0]);
      root.style.setProperty('--color-gradient-end', activeTheme.colors.gradient[1]);
    } else {
      root.style.setProperty('--color-gradient-start', activeTheme.colors.primary);
      root.style.setProperty('--color-gradient-end', activeTheme.colors.secondary);
    }
  }

  // Set typography
  if (activeTheme.typography && activeTheme.typography.fontFamily) {
    const headFont = activeTheme.typography.fontFamily.headings || "'Sahitya', 'Lora', serif";
    const bodyFont = activeTheme.typography.fontFamily.body || "'Lora', serif";
    root.style.setProperty('--font-family-headings', headFont);
    root.style.setProperty('--font-family-body', bodyFont);
  }

  // Set animation configurations
  if (activeTheme.animations) {
    root.style.setProperty('--animation-page-flip-speed', `${activeTheme.animations.pageFlipSpeed || 0.6}s`);
    root.style.setProperty('--lighting-intensity', activeTheme.animations.lightingIntensity !== undefined ? activeTheme.animations.lightingIntensity : 1);
  }
};
