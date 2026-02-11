'use client';

import React, { useState } from 'react';
import { User } from '@/lib/db-mock'; // Using the User interface type
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, User as UserIcon, Lock } from 'lucide-react';

interface ProfileViewProps {
    user: User;
    onUpdate?: (updatedUser: User) => void;
}

export function ProfileView({ user, onUpdate }: ProfileViewProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Profile State
    const [name, setName] = useState(user.name);
    const [shopName, setShopName] = useState(user.shopName || '');
    const [location, setLocation] = useState(user.location || '');
    const [email, setEmail] = useState(user.email || '');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    name,
                    shopName,
                    location,
                    email
                })
            });

            if (res.ok) {
                const updatedData = await res.json();
                toast.success('Profile updated successfully');
                if (onUpdate) {
                    onUpdate({ ...user, ...updatedData });
                }
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to update profile');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    currentPassword,
                    newPassword
                })
            });

            if (res.ok) {
                toast.success('Password changed successfully');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to change password');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Account Settings</h2>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <TabsTrigger value="general" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">
                        <UserIcon className="w-4 h-4 mr-2" /> General
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-sm">
                        <Lock className="w-4 h-4 mr-2" /> Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details and shop information.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleUpdateProfile}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shopName">Shop Name</Label>
                                    <Input id="shopName" value={shopName} onChange={e => setShopName(e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" value={user.phone} disabled className="bg-slate-50 dark:bg-slate-900" />
                                        <p className="text-[10px] text-slate-500">Phone number cannot be changed.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email (Optional)</Label>
                                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location / Address</Label>
                                    <Input id="location" value={location} onChange={e => setLocation(e.target.value)} required />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t bg-slate-50/50 dark:bg-slate-900/50 p-4">
                                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>Change your password to keep your account secure.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleChangePassword}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current">Current Password</Label>
                                    <Input
                                        id="current"
                                        type="password"
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new">New Password</Label>
                                    <Input
                                        id="new"
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Confirm New Password</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t bg-slate-50/50 dark:bg-slate-900/50 p-4">
                                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Update Password
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
