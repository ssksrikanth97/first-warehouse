"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { User, Bell, Shield, Smartphone } from 'lucide-react'

export function SettingsView() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Settings</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage your application and profile settings</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 dark:bg-indigo-900/30 text-primary">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Profile Information</CardTitle>
                                <CardDescription>Update your account details and contact info</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                                <Input id="name" defaultValue="Demo Admin" className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                                <Input id="phone" defaultValue="1234567890" disabled className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed" />
                            </div>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90 shadow-sm shadow-indigo-100">Save Changes</Button>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 dark:bg-indigo-900/30 text-primary">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Security</CardTitle>
                                <CardDescription>Manage your password and authentication</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="cur-pass" className="text-sm font-semibold">Current Password</Label>
                            <Input id="cur-pass" type="password" placeholder="••••••••" className="max-w-md border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="new-pass" className="text-sm font-semibold">New Password</Label>
                                <Input id="new-pass" type="password" placeholder="At least 8 characters" className="border-slate-200 dark:border-slate-800" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cfm-pass" className="text-sm font-semibold">Confirm Password</Label>
                                <Input id="cfm-pass" type="password" placeholder="Repeat new password" className="border-slate-200 dark:border-slate-800" />
                            </div>
                        </div>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 dark:hover:bg-indigo-900/20">Update Password</Button>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/5 dark:bg-indigo-900/30 text-primary">
                                <Smartphone className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">App Preferences</CardTitle>
                                <CardDescription>Configure application behavior</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-0 pt-0">
                        <div className="flex items-center justify-between py-6">
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Order Notifications</p>
                                <p className="text-xs text-slate-500">Receive alerts for new incoming orders</p>
                            </div>
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400">Enabled</Badge>
                        </div>
                        <Separator className="bg-slate-100 dark:bg-slate-800" />
                        <div className="flex items-center justify-between py-6">
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Auto-approve Credit</p>
                                <p className="text-xs text-slate-500">Automatically approve orders within credit limit</p>
                            </div>
                            <Badge variant="outline" className="text-slate-400 border-slate-200 dark:border-slate-800">Disabled</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
