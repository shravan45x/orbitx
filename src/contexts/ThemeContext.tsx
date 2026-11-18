import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'orbitx-theme';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
        }
        return 'dark';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const changeThemeWithTransition = (nextTheme: Theme) => {
        if (nextTheme === theme) return;

        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const supportsViewTransitions = typeof document !== 'undefined' && 'startViewTransition' in document;

        if (!supportsViewTransitions || isReducedMotion) {
            setThemeState(nextTheme);
            return;
        }

        // Origin at top center of viewport
        const x = window.innerWidth / 2;
        const y = 0;
        const endRadius = Math.ceil(Math.hypot(window.innerWidth / 2, window.innerHeight)) + 20;

        const transition = (document as unknown as { startViewTransition: (cb: () => void) => { ready: Promise<void> } }).startViewTransition(() => {
            flushSync(() => {
                setThemeState(nextTheme);
                document.documentElement.setAttribute('data-theme', nextTheme);
                document.body.setAttribute('data-theme', nextTheme);
            });
        });

        transition.ready.then(() => {
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 650,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    pseudoElement: '::view-transition-new(root)',
                }
            );
        }).catch(() => {
            // Gracefully ignore aborted transitions
        });
    };

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        changeThemeWithTransition(nextTheme);
    };

    // Global keyboard shortcut to toggle theme: 'T' (when not typing in form inputs) or 'Alt + T'
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isTyping = target && (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.tagName === 'SELECT' ||
                target.isContentEditable
            );

            const isAltT = event.altKey && (event.key === 't' || event.key === 'T');
            const isKeyT = !isTyping && !event.ctrlKey && !event.altKey && !event.metaKey && (event.key === 't' || event.key === 'T');

            if (isAltT || isKeyT) {
                event.preventDefault();
                toggleTheme();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        changeThemeWithTransition(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
