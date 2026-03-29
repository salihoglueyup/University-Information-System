import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
    persist(
        (set) => ({
            theme: 'light',
            toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
            language: 'tr',
            setLanguage: (lang) => set({ language: lang })
        }),
        {
            name: 'ubis-app-storage',
        }
    )
);
