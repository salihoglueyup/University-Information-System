/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    radius: 0.5,
    fontSize: 16,
    setTheme: () => { },
    setRadius: () => { },
    setFontSize: () => { }
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('ui-theme') || 'light');
    const [radius, setRadius] = useState(parseFloat(localStorage.getItem('ui-radius') || 0.75));
    const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('ui-fontsize') || 14));

    useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem('ui-theme', theme);
    }, [theme]);

    useEffect(() => {
        document.documentElement.style.setProperty('--radius', `${radius}rem`);
        localStorage.setItem('ui-radius', radius);
    }, [radius]);

    // We can use a root font-size approach or specific class approach.
    // simpler is using dataset attributes for tailwind or CSS vars
    // For this demo, let's presume we might attach a data attribute
    useEffect(() => {
        document.documentElement.style.fontSize = `${fontSize}px`; // Root font size mostly, but standard is 16px.
        // Or we just store it for components to use.
        // Let's stick to standard behavior:
        // A real app might toggle 'text-sm' vs 'text-base' globally, but changing root pixel size is easiest.
        localStorage.setItem('ui-fontsize', fontSize);
    }, [fontSize]);


    return (
        <ThemeContext.Provider value={{ theme, setTheme, radius, setRadius, fontSize, setFontSize }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const ThemeCustomizer = ({ className = '' }) => {
    const { theme, setTheme, radius, setRadius } = useTheme();

    return (
        <div className={`p-4 bg-white border border-slate-200 rounded-xl shadow-lg w-64 ${className}`}>
            <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase">Görünüm Ayarları</h3>

            <div className="mb-4">
                <label className="text-xs font-semibold text-slate-500 mb-2 block">Tema</label>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => setTheme('light')}
                        className={`px-3 py-2 rounded-lg text-sm border ${theme === 'light' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                    >
                        Açık
                    </button>
                    <button
                        onClick={() => setTheme('dark')}
                        className={`px-3 py-2 rounded-lg text-sm border ${theme === 'dark' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}
                    >
                        Koyu
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <label className="text-xs font-semibold text-slate-500 mb-2 block">Köşe Yuvarlaklığı</label>
                <div className="flex gap-2">
                    {[0, 0.3, 0.5, 0.75, 1.0].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRadius(r)}
                            className={`w-8 h-8 flex items-center justify-center border transition-all ${radius === r ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
                            style={{ borderRadius: `${r}rem` }}
                        >
                            <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ThemeCustomizer;
