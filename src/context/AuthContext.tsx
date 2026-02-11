'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/db-mock';

interface AuthContextType {
    user: User | null;
    login: (phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('kb2b_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (phone: string, password?: string) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 503) {
                    throw new Error(data.message || 'System Maintenance');
                }
                return { success: false, error: data.error || 'Login failed' };
            }

            setUser(data.user);
            localStorage.setItem('kb2b_user', JSON.stringify(data.user));
            return { success: true };
        } catch (error) {
            console.error("Login Error:", error);
            const msg = error instanceof Error ? error.message : 'Login error';
            if (msg.includes('Maintenance')) {
                alert(msg);
            }
            return { success: false, error: msg };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('kb2b_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
