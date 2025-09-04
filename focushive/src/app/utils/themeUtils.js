/**
 * Theme utilities for handling sidebar vs main view styling
 * Consolidates repeated isInSidebar conditional styling patterns
 */

/**
 * Get text color classes based on context and hierarchy
 * @param {boolean} isInSidebar - Whether component is in sidebar context
 * @param {string} variant - Text variant (primary, secondary, muted, etc.)
 * @returns {string} CSS classes
 */
export function getTextTheme(isInSidebar, variant = 'primary') {
  const themes = {
    primary: {
      sidebar: 'text-gray-800',
      main: 'text-white'
    },
    secondary: {
      sidebar: 'text-gray-700',
      main: 'text-white'
    },
    muted: {
      sidebar: 'text-gray-600',
      main: 'text-white/60'
    },
    subtle: {
      sidebar: 'text-gray-500',
      main: 'text-white/40'
    },
    disabled: {
      sidebar: 'text-gray-400',
      main: 'text-white/30'
    }
  };

  const theme = themes[variant] || themes.primary;
  return isInSidebar ? theme.sidebar : theme.main;
}

/**
 * Get interactive text color classes with hover states
 * @param {boolean} isInSidebar - Whether component is in sidebar context
 * @param {string} variant - Interactive variant (primary, secondary)
 * @returns {string} CSS classes with hover states
 */
export function getInteractiveTextTheme(isInSidebar, variant = 'primary') {
  const themes = {
    primary: {
      sidebar: 'text-gray-600 hover:text-gray-800',
      main: 'text-white/60 hover:text-white'
    },
    secondary: {
      sidebar: 'text-gray-500 hover:text-gray-700',
      main: 'text-white/40 hover:text-white/60'
    }
  };

  const theme = themes[variant] || themes.primary;
  return isInSidebar ? theme.sidebar : theme.main;
}

/**
 * Get button theme classes based on context
 * @param {boolean} isInSidebar - Whether component is in sidebar context
 * @param {string} variant - Button variant (primary, secondary, danger)
 * @returns {string} CSS classes
 */
export function getButtonTheme(isInSidebar, variant = 'primary') {
  const themes = {
    primary: {
      sidebar: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      main: 'bg-white/10 hover:bg-white/20 text-white'
    },
    secondary: {
      sidebar: 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800',
      main: 'border-white/30 hover:border-white/50 text-white/60 hover:text-white'
    },
    danger: {
      sidebar: 'bg-red-100 hover:bg-red-200 text-red-700',
      main: 'bg-red-500/10 hover:bg-red-500/20 text-red-300'
    }
  };

  const theme = themes[variant] || themes.primary;
  return isInSidebar ? theme.sidebar : theme.main;
}

/**
 * Get background theme classes
 * @param {boolean} isInSidebar - Whether component is in sidebar context
 * @param {string} variant - Background variant (primary, secondary, selected)
 * @returns {string} CSS classes
 */
export function getBackgroundTheme(isInSidebar, variant = 'primary') {
  const themes = {
    primary: {
      sidebar: 'bg-white',
      main: 'bg-black/20'
    },
    secondary: {
      sidebar: 'bg-gray-50',
      main: 'bg-white/5'
    },
    selected: {
      sidebar: 'bg-blue-50 border-blue-200',
      main: 'bg-white/10 border-white/20'
    },
    hover: {
      sidebar: 'hover:bg-gray-50',
      main: 'hover:bg-white/5'
    }
  };

  const theme = themes[variant] || themes.primary;
  return isInSidebar ? theme.sidebar : theme.main;
}

/**
 * Get border theme classes
 * @param {boolean} isInSidebar - Whether component is in sidebar context
 * @param {string} variant - Border variant (primary, secondary, dashed)
 * @returns {string} CSS classes
 */
export function getBorderTheme(isInSidebar, variant = 'primary') {
  const themes = {
    primary: {
      sidebar: 'border-gray-200',
      main: 'border-white/20'
    },
    secondary: {
      sidebar: 'border-gray-300',
      main: 'border-white/30'
    },
    dashed: {
      sidebar: 'border-dashed border-gray-300 hover:border-gray-400',
      main: 'border-dashed border-white/30 hover:border-white/50'
    }
  };

  const theme = themes[variant] || themes.primary;
  return isInSidebar ? theme.sidebar : theme.main;
}

/**
 * Generic theme utility for custom theme objects
 * @param {boolean} isInSidebar - Whether component is in sidebar context
 * @param {Object} themeConfig - Object with sidebar and main properties
 * @returns {string} CSS classes
 */
export function getCustomTheme(isInSidebar, themeConfig) {
  if (!themeConfig || typeof themeConfig !== 'object') {
    return '';
  }

  return isInSidebar ? themeConfig.sidebar || '' : themeConfig.main || '';
}

/**
 * Get combined theme classes for common component patterns
 * @param {boolean} isInSidebar - Whether component is in sidebar context
 * @param {string} pattern - Common pattern (listItem, button, input, etc.)
 * @returns {string} CSS classes
 */
export function getComponentTheme(isInSidebar, pattern) {
  const patterns = {
    listItem: {
      sidebar: 'text-gray-700 hover:text-gray-800 hover:bg-gray-50',
      main: 'text-white/60 hover:text-white hover:bg-white/5'
    },
    addButton: {
      sidebar: 'border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 hover:bg-gray-50',
      main: 'border-dashed border-white/30 hover:border-white/50 text-white/60 hover:text-white hover:bg-white/5'
    },
    input: {
      sidebar: 'border-gray-300 focus:border-blue-500 bg-white text-gray-900',
      main: 'border-white/30 focus:border-white/50 bg-white/10 text-white placeholder-white/40'
    }
  };

  const pattern_config = patterns[pattern];
  if (!pattern_config) {
    return '';
  }

  return isInSidebar ? pattern_config.sidebar : pattern_config.main;
}