'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Lock, Unlock, KeyRound, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string;
    phone: string;
    role: string;
    shopName?: string;
    isActive: boolean;
    createdAt: string;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Action State
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/super/users');
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleToggleStatus = async (user: User) => {
        try {
            const res = await fetch('/api/super/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: user.id,
                    action: 'TOGGLE_STATUS'
                })
            });

            if (res.ok) {
                toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
                loadUsers();
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    const handleResetPassword = async () => {
        if (!selectedUser || !newPassword) return;

        try {
            const res = await fetch('/api/super/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedUser.id,
                    action: 'RESET_PASSWORD',
                    payload: { newPassword }
                })
            });

            if (res.ok) {
                toast.success('Password reset successfully');
                setIsPasswordDialogOpen(false);
                setNewPassword('');
                setSelectedUser(null);
            } else {
                toast.error('Failed to reset password');
            }
        } catch (error) {
            toast.error('Error resetting password');
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search) ||
        u.shopName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-6xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
                    <p className="text-slate-500">Manage access and credentials for all users.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-slate-500" />
                <Input
                    placeholder="Search by name, phone or shop..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.phone} {user.shopName && `• ${user.shopName}`}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'SUPER_ADMIN' ? 'destructive' : user.role === 'ADMIN' ? 'default' : 'outline'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.isActive ? 'outline' : 'secondary'} className={user.isActive ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : ''}>
                                            {user.isActive ? 'Active' : 'Locked'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsPasswordDialogOpen(true);
                                                }}
                                                title="Reset Password"
                                            >
                                                <KeyRound className="h-4 w-4 text-slate-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleStatus(user)}
                                                title={user.isActive ? "Lock Account" : "Unlock Account"}
                                                className={user.isActive ? "text-red-500 hover:bg-red-50" : "text-emerald-500 hover:bg-emerald-50"}
                                            >
                                                {user.isActive ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Set a new password for {selectedUser?.name} ({selectedUser?.phone}).
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>New Password</Label>
                        <Input
                            type="text"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleResetPassword} disabled={!newPassword}>Reset Password</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
