import React, { createContext, useContext, useEffect, useState } from 'react';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [dark, setDark] = useState(() => localStorage.getItem('nl_theme') !== 'light');

    useEffect(() => {
        if (dark) {
            document.body.classList.remove('light');
        } else {
            document.body.classList.add('light');
        }
        localStorage.setItem('nl_theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <DarkModeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => useContext(DarkModeContext);
