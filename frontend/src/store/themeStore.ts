import { create } from 'zustand';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDark: localStorage.getItem('theme') === 'dark',
  toggleTheme: () => {
    const newDark = !get().isDark;
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDark);
    set({ isDark: newDark });
  },
}));
