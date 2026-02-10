"use client"

import React from 'react'
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Phone, MoreHorizontal } from 'lucide-react'
import { Input } from "@/components/ui/input"

export function CustomersView() {
    const retailers = [
        { id: '1', name: 'Ramesh Kumar', shopName: 'Ramesh Kirana Store', location: 'HSR Layout', phone: '9876543210', creditLimit: 25000, balance: 4500 },
        { id: '2', name: 'Suresh Patil', shopName: 'Patil General Stores', location: 'Koramangala', phone: '9876543211', creditLimit: 50000, balance: 12800 },
        { id: '3', name: 'Anita Sharma', shopName: 'Sharma Super Market', location: 'Indiranagar', phone: '9876543212', creditLimit: 100000, balance: 0 },
        { id: '4', name: 'Mahesh Gupta', shopName: 'Gupta Traders', location: 'Whitefield', phone: '9876543213', creditLimit: 15000, balance: 2200 },
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Customers</h2>
                    <p className="text-slate-500 dark:text-slate-400">View and manage retailer accounts</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-10 shadow-sm">
                    Add New Retailer
                </Button>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input placeholder="Search Shop or Phone..." className="pl-9 h-10" />
                </div>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <TableHead>Retailer & Shop</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead className="text-right">Credit Limit</TableHead>
                            <TableHead className="text-right">Outstanding</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {retailers.map((r) => (
                            <TableRow key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                <TableCell>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-slate-100">{r.shopName}</p>
                                        <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                            <MapPin className="mr-1 h-3 w-3" /> {r.location}
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
                                    ₹{r.creditLimit.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge
                                        variant={r.balance > 10000 ? 'destructive' : 'secondary'}
                                        className={`font-mono ${r.balance <= 10000 ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' : ''}`}
                                    >
                                        ₹{r.balance.toLocaleString()}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    )
}
