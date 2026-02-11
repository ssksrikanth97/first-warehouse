'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Server, MonitorStop } from 'lucide-react';

export default function SuperAdminDashboard() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">System Overview</h2>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <Server className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">Healthy</div>
                        <p className="text-xs text-muted-foreground">All services operational</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Detailed Security Logs</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Secure</div>
                        <p className="text-xs text-muted-foreground">No recent threats detected</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Maintenance Mode</CardTitle>
                        <MonitorStop className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-600">Off</div>
                        <p className="text-xs text-muted-foreground">System accessible to all users</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
