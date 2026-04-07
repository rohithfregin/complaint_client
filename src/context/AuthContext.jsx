import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage so user stays logged in on refresh
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => localStorage.getItem('token') || null);

    // Login: store user + token in state and localStorage
    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
    };

    // Logout: clear everything
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const isAdmin = user?.role === 'admin';
    const isStudent = user?.role === 'student';

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isStudent }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access to auth context
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export default AuthContext;
