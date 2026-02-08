import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'dark' | 'light';

interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface SettingsContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  scheduleZoom: number;
  setScheduleZoom: (zoom: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  customColors: CustomColors;
  setCustomColors: (colors: Partial<CustomColors>) => void;
  resetCustomColors: () => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  resetToDefaults: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_COLORS: CustomColors = {
  primary: '#3b82f6',
  secondary: '#1e40af',
  accent: '#f59e0b',
  background: '#020617',
  text: '#f8fafc',
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('tutor_theme');
    return (saved as ThemeType) || 'dark';
  });

  const [scheduleZoom, setScheduleZoomState] = useState<number>(() => {
    const saved = localStorage.getItem('tutor_schedule_zoom');
    return saved ? parseFloat(saved) : 1;
  });

  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('tutor_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem('tutor_notifications_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [customColors, setCustomColorsState] = useState<CustomColors>(() => {
    const saved = localStorage.getItem('tutor_custom_colors');
    return saved ? JSON.parse(saved) : DEFAULT_COLORS;
  });

  // Apply theme to document
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('light', 'dark');
    html.classList.add(theme);
    localStorage.setItem('tutor_theme', theme);
  }, [theme]);

  // Save zoom level
  useEffect(() => {
    localStorage.setItem('tutor_schedule_zoom', scheduleZoom.toString());
  }, [scheduleZoom]);

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('tutor_sound_enabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // Save notifications preference
  useEffect(() => {
    localStorage.setItem('tutor_notifications_enabled', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  // Apply custom colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', customColors.primary);
    root.style.setProperty('--color-secondary', customColors.secondary);
    root.style.setProperty('--color-accent', customColors.accent);
    localStorage.setItem('tutor_custom_colors', JSON.stringify(customColors));
  }, [customColors]);

  const exportData = (): string => {
    const students = localStorage.getItem('tutor_students_v3') || '[]';
    const sessions = localStorage.getItem('tutor_sessions_v3') || '[]';
    const schoolSessions = localStorage.getItem('tutor_school_sessions') || '[]';
    const theme = localStorage.getItem('tutor_theme') || 'dark';
    const zoom = localStorage.getItem('tutor_schedule_zoom') || '1';
    const soundEnabled = localStorage.getItem('tutor_sound_enabled') || 'true';
    const notificationsEnabled = localStorage.getItem('tutor_notifications_enabled') || 'true';
    const customColors = localStorage.getItem('tutor_custom_colors') || JSON.stringify(DEFAULT_COLORS);

    const backup = {
      version: '1.0',
      date: new Date().toISOString(),
      theme,
      zoom,
      soundEnabled,
      notificationsEnabled,
      customColors: JSON.parse(customColors),
      students: JSON.parse(students),
      sessions: JSON.parse(sessions),
      schoolSessions: JSON.parse(schoolSessions)
    };

    return JSON.stringify(backup, null, 2);
  };

  const importData = (jsonData: string): boolean => {
    try {
      const backup = JSON.parse(jsonData);
      
      if (!backup.version || !backup.students || !backup.sessions) {
        console.error('Invalid backup format');
        return false;
      }

      localStorage.setItem('tutor_students_v3', JSON.stringify(backup.students));
      localStorage.setItem('tutor_sessions_v3', JSON.stringify(backup.sessions));
      if (backup.schoolSessions) localStorage.setItem('tutor_school_sessions', JSON.stringify(backup.schoolSessions));
      if (backup.theme) localStorage.setItem('tutor_theme', backup.theme);
      if (backup.zoom) localStorage.setItem('tutor_schedule_zoom', backup.zoom);
      if (backup.soundEnabled !== undefined) localStorage.setItem('tutor_sound_enabled', backup.soundEnabled);
      if (backup.notificationsEnabled !== undefined) localStorage.setItem('tutor_notifications_enabled', backup.notificationsEnabled);
      if (backup.customColors) localStorage.setItem('tutor_custom_colors', JSON.stringify(backup.customColors));

      window.location.reload();
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  };

  const resetToDefaults = () => {
    if (confirm('هل أنت متأكد أنك تريد حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه')) {
      localStorage.removeItem('tutor_students_v3');
      localStorage.removeItem('tutor_sessions_v3');
      localStorage.removeItem('tutor_school_sessions');
      localStorage.removeItem('tutor_theme');
      localStorage.removeItem('tutor_schedule_zoom');
      localStorage.removeItem('tutor_sound_enabled');
      localStorage.removeItem('tutor_notifications_enabled');
      localStorage.removeItem('tutor_custom_colors');
      localStorage.removeItem('app_initialized');
      window.location.reload();
    }
  };

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const setScheduleZoom = (zoom: number) => {
    const clampedZoom = Math.max(0.1, Math.min(2, zoom));
    setScheduleZoomState(clampedZoom);
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
  };

  const setCustomColors = (colors: Partial<CustomColors>) => {
    setCustomColorsState(prev => ({ ...prev, ...colors }));
  };

  const resetCustomColors = () => {
    setCustomColorsState(DEFAULT_COLORS);
  };

  return (
    <SettingsContext.Provider value={{
      theme,
      setTheme,
      scheduleZoom,
      setScheduleZoom,
      soundEnabled,
      setSoundEnabled,
      notificationsEnabled,
      setNotificationsEnabled,
      customColors,
      setCustomColors,
      resetCustomColors,
      exportData,
      importData,
      resetToDefaults
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
