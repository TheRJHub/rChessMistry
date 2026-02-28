import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const themes = {
  dark: {
    name: 'dark',
    background: '#0D0D0D',
    surface: '#1A1A2E',
    card: '#16213E',
    cardBorder: '#0F3460',
    primary: '#E94560',
    primaryLight: '#FF6B8A',
    secondary: '#533483',
    accent: '#FFD700',
    text: '#FFFFFF',
    textSecondary: '#A0A0B0',
    textMuted: '#606080',
    boardLight: '#F0D9B5',
    boardDark: '#B58863',
    boardBorder: '#E94560',
    statusBar: 'light',
    gradient: ['#0D0D0D', '#1A1A2E'],
    pieceHighlight: 'rgba(233, 69, 96, 0.5)',
    moveHighlight: 'rgba(255, 215, 0, 0.4)',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
  },
  light: {
    name: 'light',
    background: '#F5F0E8',
    surface: '#FFFFFF',
    card: '#FFFDF8',
    cardBorder: '#E8DCC8',
    primary: '#8B4513',
    primaryLight: '#A0522D',
    secondary: '#6B3FA0',
    accent: '#D4A017',
    text: '#1A1A1A',
    textSecondary: '#5A5A5A',
    textMuted: '#9A9A9A',
    boardLight: '#F0D9B5',
    boardDark: '#B58863',
    boardBorder: '#8B4513',
    statusBar: 'dark',
    gradient: ['#F5F0E8', '#EDE5D0'],
    pieceHighlight: 'rgba(139, 69, 19, 0.4)',
    moveHighlight: 'rgba(212, 160, 23, 0.5)',
    success: '#388E3C',
    error: '#D32F2F',
    warning: '#F57C00',
  },
  grey: {
    name: 'grey',
    background: '#1C1C1E',
    surface: '#2C2C2E',
    card: '#3A3A3C',
    cardBorder: '#48484A',
    primary: '#636366',
    primaryLight: '#8E8E93',
    secondary: '#48484A',
    accent: '#AEAEB2',
    text: '#FFFFFF',
    textSecondary: '#AEAEB2',
    textMuted: '#636366',
    boardLight: '#DEDEDE',
    boardDark: '#8C8C8C',
    boardBorder: '#AEAEB2',
    statusBar: 'light',
    gradient: ['#1C1C1E', '#2C2C2E'],
    pieceHighlight: 'rgba(174, 174, 178, 0.4)',
    moveHighlight: 'rgba(255, 255, 255, 0.2)',
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
  },
};

const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await SecureStore.getItemAsync('rchessmistry_theme');
      if (saved && themes[saved]) setThemeName(saved);
    } catch {}
  };

  const setTheme = async (name) => {
    if (!themes[name]) return;
    setThemeName(name);
    try {
      await SecureStore.setItemAsync('rchessmistry_theme', name);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], themeName, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;
