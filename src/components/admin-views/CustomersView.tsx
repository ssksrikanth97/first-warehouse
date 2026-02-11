"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Phone, CheckCircle2, XCircle, Plus, Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { Switch } from "@/components/ui/switch"

interface Retailer {
    id: string
    name: string
    shopName: string | null
    location: string | null
    phone: string
    // creditLimit: number // Removed
    ordersCount: number
    totalSpend: number
    outstandingBalance: number
    isActive: boolean
    createdAt: string
}

export function CustomersView() {
    const [retailers, setRetailers] = useState<Retailer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchRetailers = async () => {
        try {
            const res = await fetch('/api/customers')
            if (res.ok) {
                const data = await res.json()
                setRetailers(data)
            }
        } catch (error) {
            console.error("Failed to fetch retailers", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRetailers()
    }, [])

    const handleResetPassword = async (phone: string, name: string) => {
        if (!confirm(`Are you sure you want to reset the password for ${name}?`)) return;

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact: phone })
            })

            if (res.ok) {
                alert("Password reset link generated! Check server console.");
            } else {
                alert("Failed to initiate password reset.");
            }
        } catch (error) {
            console.error("Error resetting password", error);
            alert("An error occurred.");
        }
    }

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setRetailers(prev => prev.map(r => r.id === id ? { ...r, isActive: !currentStatus } : r))

        try {
            const res = await fetch(`/api/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            })
            if (!res.ok) {
                // Revert on failure
                setRetailers(prev => prev.map(r => r.id === id ? { ...r, isActive: currentStatus } : r))
            }
        } catch (error) {
            console.error("Error updating status", error)
            setRetailers(prev => prev.map(r => r.id === id ? { ...r, isActive: currentStatus } : r))
        }
    }

    const filteredRetailers = retailers.filter(r =>
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.shopName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery)
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Customers</h2>
                    <p className="text-slate-500 dark:text-slate-400">View and manage retailer accounts</p>
                </div>
                <Link href="/admin/customers/new">
                    <Button className="bg-primary hover:bg-primary/90 h-10 shadow-sm">
                        <Plus className="mr-2 h-4 w-4" /> Add New Retailer
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search Shop or Phone..."
                        className="pl-9 h-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <TableHead>Retailer & Shop</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead className="text-right">Orders</TableHead>
                            <TableHead className="text-right">Total Spend</TableHead>
                            <TableHead className="text-right">Outstanding</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Customer Since</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                                </TableCell>
                            </TableRow>
                        ) : filteredRetailers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                    No retailers found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredRetailers.map((r) => (
                                <TableRow key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <TableCell>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-slate-100">{r.shopName || 'No Shop Name'}</p>
                                            <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                                <MapPin className="mr-1 h-3 w-3" /> {r.location || 'Unknown Location'}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{r.name}</p>
                                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                                            <Phone className="mr-1 h-3 w-3" /> {r.phone}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm">
                                        {r.ordersCount}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-sm">
                                        ₹{r.totalSpend.toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            variant={r.outstandingBalance > 10000 ? 'destructive' : 'secondary'}
                                            className={`font-mono ${r.outstandingBalance <= 10000 ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' : ''}`}
                                        >
                                            ₹{r.outstandingBalance.toLocaleString()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Switch
                                                checked={r.isActive}
                                                onCheckedChange={() => toggleStatus(r.id, r.isActive)}
                                            />
                                            <span className={`text-xs font-medium ${r.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {r.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right text-xs text-slate-500">
                                        <div className="flex flex-col items-end gap-1">
                                            <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs text-blue-600 hover:text-blue-800"
                                                onClick={() => handleResetPassword(r.phone, r.name)}
                                            >
                                                Reset Password
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
