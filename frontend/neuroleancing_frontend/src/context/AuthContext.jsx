import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On mount: restore non-sensitive user info from localStorage (no token)
    // and verify session is still valid via cookie
    useEffect(() => {
        const stored = localStorage.getItem('nl_user');
        if (stored) {
            try { setUser(JSON.parse(stored)); } catch (_) {}
        }
        // Verify cookie session is still valid
        getMe()
            .then(data => {
                const safe = {
                    id:              data._id || data.id,
                    name:            data.name,
                    email:           data.email,
                    role:            data.role,
                    profileImage:    data.profileImage,
                    profileComplete: data.profileComplete,
                    skills:          data.skills  || [],
                    title:           data.title   || '',
                    bio:             data.bio     || '',
                    location:        data.location || '',
                    hourlyRate:      data.hourlyRate ?? null,
                };
                setUser(safe);
                localStorage.setItem('nl_user', JSON.stringify(safe));
            })
            .catch(() => {
                // 401 = no active session — expected on public pages, clear stale state
                setUser(null);
                localStorage.removeItem('nl_user');
            })
            .finally(() => setLoading(false));
    }, []);

    const login = (userData) => {
        const safe = {
            id:              userData._id || userData.id,
            name:            userData.name,
            email:           userData.email,
            role:            userData.role,
            profileImage:    userData.profileImage,
            profileComplete: userData.profileComplete,
            skills:          userData.skills  || [],
            title:           userData.title   || '',
            bio:             userData.bio     || '',
            location:        userData.location || '',
            hourlyRate:      userData.hourlyRate ?? null,
        };
        setUser(safe);
        localStorage.setItem('nl_user', JSON.stringify(safe));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('nl_user');
    };

    const updateUser = (updatedData) => {
        const safe = {
            id:              updatedData._id || updatedData.id || user?.id,
            name:            updatedData.name            ?? user?.name,
            email:           updatedData.email           ?? user?.email,
            role:            updatedData.role            ?? user?.role,
            profileImage:    updatedData.profileImage    ?? user?.profileImage,
            profileComplete: updatedData.profileComplete ?? user?.profileComplete,
            skills:          updatedData.skills          ?? user?.skills ?? [],
            title:           updatedData.title           ?? user?.title  ?? '',
            bio:             updatedData.bio             ?? user?.bio    ?? '',
            location:        updatedData.location        ?? user?.location ?? '',
            hourlyRate:      updatedData.hourlyRate      ?? user?.hourlyRate ?? null,
        };
        setUser(safe);
        localStorage.setItem('nl_user', JSON.stringify(safe));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
