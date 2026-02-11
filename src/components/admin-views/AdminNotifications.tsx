'use client';

import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Notification {
    id: string;
    type: 'USER_ONBOARDED' | 'ORDER_GENERATED';
    message: string;
    timestamp: string;
    read: boolean;
}

export function AdminNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/admin/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                // Simple logic: if any notifications exist, show badge (or persist read state in local storage/DB)
                // For now, if we have data, we show badge.
                if (data.length > 0) {
                    setHasUnread(true);
                }
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setHasUnread(false); // Clear badge on open
        }
    };

    return (
        <div className="relative">
            <Button variant="ghost" size="icon" className="relative text-slate-600 dark:text-slate-400 hover:text-primary" onClick={handleOpen}>
                <Bell className="h-5 w-5" />
                {hasUnread && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 z-50">
                    <Card className="shadow-lg border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            <span className="text-xs text-slate-500">{notifications.length} New</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-500">
                                    No new notifications
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {notifications.map((notif) => (
                                        <li key={notif.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <div className="flex gap-3 items-start">
                                                <div className={`h-2 w-2 mt-1.5 rounded-full ${notif.type === 'ORDER_GENERATED' ? 'bg-emerald-500' : 'bg-primary'}`} />
                                                <div>
                                                    <p className="text-sm text-slate-800 dark:text-slate-200">{notif.message}</p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {new Date(notif.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {/* Overlay to close on click outside */}
            {isOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            )}
        </div>
    );
}
