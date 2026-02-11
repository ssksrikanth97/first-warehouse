'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SystemSetting {
    key: string;
    value: string;
    description: string;
}

export default function SystemSettingsPage() {
    const [settings, setSettings] = useState<SystemSetting[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadSettings = async () => {
        try {
            const res = await fetch('/api/super/settings');
            if (res.ok) {
                setSettings(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const updateSetting = async (key: string, value: string, description?: string) => {
        try {
            const res = await fetch('/api/super/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value, description })
            });
            if (res.ok) {
                toast.success('Setting updated');
                loadSettings();
            } else {
                toast.error('Failed to update');
            }
        } catch (error) {
            toast.error('Error updating setting');
        }
    };

    const getSettingValue = (key: string, defaultValue = '') => {
        return settings.find(s => s.key === key)?.value || defaultValue;
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>

            <Card className="border-red-200 dark:border-red-900/50">
                <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400">Maintenance Mode</CardTitle>
                    <CardDescription>
                        When enabled, only Super Admins can log in. All other users will be blocked.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                        <div className="space-y-0.5">
                            <Label className="text-base">Enable Maintenance Mode</Label>
                            <p className="text-sm text-slate-500">
                                Stop all user activity immediately.
                            </p>
                        </div>
                        <Switch
                            checked={getSettingValue('MAINTENANCE_MODE') === 'true'}
                            onCheckedChange={(checked) => updateSetting('MAINTENANCE_MODE', checked ? 'true' : 'false')}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Maintenance Message</Label>
                        <div className="flex gap-2">
                            <Input
                                defaultValue={getSettingValue('MAINTENANCE_MESSAGE', 'We are currently upgrading the system. Please try again later.')}
                                id="maintenance-message"
                            />
                            <Button
                                onClick={() => {
                                    const msg = (document.getElementById('maintenance-message') as HTMLInputElement).value;
                                    updateSetting('MAINTENANCE_MESSAGE', msg);
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
