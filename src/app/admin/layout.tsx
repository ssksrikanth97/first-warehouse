"use client"

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminProvider } from '@/context/AdminContext';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminNotifications } from '@/components/admin-views/AdminNotifications';
import { ModeToggle } from '@/components/ModeToggle';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center font-bold">Loading...</div>;
    }

    if (!user || user.role !== 'ADMIN') {
        redirect('/login');
    }

    return (
        <AdminProvider>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                    <div className="mx-auto flex max-w-[1400px] items-center justify-between p-4 px-6">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <LayoutDashboard className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-900 dark:text-white">Distributor Panel</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Welcome, {user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <AdminNotifications />
                            <ModeToggle />
                            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600 dark:text-slate-400 hover:text-primary">
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="mx-auto flex max-w-[1400px]">
                    <AdminSidebar />
                    <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500">
                        {children}
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}
