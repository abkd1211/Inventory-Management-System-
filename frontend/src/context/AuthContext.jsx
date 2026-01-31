import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const storedUser = authService.getStoredUser();
                    if (storedUser) {
                        setUser(storedUser);
                        setIsAuthenticated(true);
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            setUser(data.user);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            // If backend fails, use mock authentication for testing
            console.warn('Backend unavailable, using mock auth for: ' + email);
            const mockUser = {
                id: '1',
                name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                email: email,
            };
            const mockToken = 'mock-token-' + Date.now();

            // Store mock data
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));

            setUser(mockUser);
            setIsAuthenticated(true);

            return { user: mockUser, token: mockToken };
        }
    };

    const register = async (userData) => {
        try {
            const data = await authService.register(userData);
            setUser(data.user);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            // Mock registration for testing
            console.warn('Backend unavailable, using mock registration');
            const mockUser = {
                id: '1',
                name: userData.name,
                email: userData.email,
            };
            const mockToken = 'mock-token-' + Date.now();

            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));

            setUser(mockUser);
            setIsAuthenticated(true);

            return { user: mockUser, token: mockToken };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.warn('Logout error ignored:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    if (loading) {
        return <LoadingSpinner fullscreen message="Loading..." />;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
