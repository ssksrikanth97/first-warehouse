'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Settings,
    Users,
    Database,
    LogOut,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const router = useRouter(); // Add this import

    React.useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return null; // or a loading spinner
    }

    if (user.role !== 'SUPER_ADMIN') {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="text-center">
                    <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
                    <h1 className="mt-4 text-2xl font-bold">Access Denied</h1>
                    <p className="mt-2 text-slate-600">You must be a Super Admin to view this page.</p>
                    <Button onClick={logout} className="mt-4" variant="outline">Back to Login</Button>
                </div>
            </div>
        );
    }

    const navigation = [
        { name: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
        { name: 'User Management', href: '/super-admin/users', icon: Users },
        { name: 'Field Config', href: '/super-admin/fields', icon: Database },
        { name: 'System Settings', href: '/super-admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-slate-900 text-white dark:bg-slate-900 hidden md:flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-red-500" />
                        Super Admin
                    </h2>
                </div>

                <nav className="flex-1 space-y-1 px-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-red-600 text-white"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t border-slate-800 p-4">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold">
                            SA
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium text-white">{user.name}</p>
                            <p className="truncate text-xs text-slate-400">Super Admin</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-400 hover:bg-slate-800 hover:text-white"
                        onClick={logout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto w-full">
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white dark:bg-slate-950 px-6 backdrop-blur-sm bg-opacity-80">
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {navigation.find(n => n.href === pathname)?.name || 'Dashboard'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
