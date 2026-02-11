"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, Eye, Loader2, Calendar, MapPin, User, ShoppingBag } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface OrderItem {
    id: string
    quantity: number
    priceAtOrder: number
    product: {
        name: string
        sku: string
        unit: string
        sellingUnit: string
    }
}

interface Order {
    id: string
    status: string
    totalAmount: number
    paymentMethod: string
    paymentStatus: string
    createdAt: string
    user: {
        name: string | null
        shopName: string | null
        phone: string
        location: string | null
    }
    items: OrderItem[]
    _count?: {
        items: number
    }
}

export function OrdersView() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders')
            if (res.ok) {
                const data = await res.json()
                setOrders(data)
            }
        } catch (error) {
            console.error("Failed to fetch orders", error)
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            case 'SHIPPED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            case 'PACKED': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
            case 'CONFIRMED': return 'bg-primary/10 text-primary/80 dark:bg-indigo-900/30 dark:text-indigo-400'
            case 'PENDING': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            case 'CANCELLED': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
        }
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.shopName?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter

        return matchesSearch && matchesStatus
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Orders</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage customer orders and fulfillment</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search orders..."
                                className="pl-9 bg-slate-50 dark:bg-slate-900"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-slate-500" />
                                        <SelectValue placeholder="Filter by Status" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Status</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                                    <SelectItem value="PACKED">Packed</SelectItem>
                                    <SelectItem value="SHIPPED">Shipped</SelectItem>
                                    <SelectItem value="DELIVERED">Delivered</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                <TableHead className="w-[100px]">Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">Items</TableHead>
                                <TableHead className="text-right">Total Amount</TableHead>
                                <TableHead className="text-center">Payment</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                                    </TableCell>
                                </TableRow>
                            ) : filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <TableCell className="font-mono text-xs font-medium text-slate-600 dark:text-slate-400">
                                            #{order.id.slice(-6).toUpperCase()}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{order.user.shopName || 'Unknown Shop'}</p>
                                                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                                                    <User className="mr-1 h-3 w-3" /> {order.user.name || 'Unknown User'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center">
                                                <Calendar className="mr-2 h-3 w-3 text-slate-400" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="font-normal text-slate-600">
                                                {order.items.length} items
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono font-medium text-slate-900 dark:text-slate-100">
                                            ₹{order.totalAmount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{order.paymentMethod}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${order.paymentStatus === 'PAID'
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                    }`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={`${getStatusColor(order.status)} border-0 hover:bg-opacity-80`}>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-primary">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
