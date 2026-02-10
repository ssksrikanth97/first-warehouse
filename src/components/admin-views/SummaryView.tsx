"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, ShoppingCart, TrendingUp, AlertCircle, ArrowUpRight, DollarSign, Activity, Sparkles, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function SummaryView() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: [],
        lowStockProducts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    // Simple AI Insights logic (static for now, could be dynamic based on stats)
    const insights = [
        {
            title: "Inventory Optimization",
            description: "3 products are nearing minimum order thresholds. Consider restock soon.",
            icon: AlertCircle,
            color: "text-amber-500 bg-amber-500/10"
        },
        {
            title: "Customer Growth",
            description: "New retailer registrations are up 15% this week. Opportunity for referral program.",
            icon: TrendingUp,
            color: "text-emerald-500 bg-emerald-500/10"
        },
        {
            title: "Pricing Strategy",
            description: "Atta prices are fluctuating. AI suggests updating bulk slab prices.",
            icon: Zap,
            color: "text-blue-500 bg-blue-500/10"
        }
    ]

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1 mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Summary</h2>
                <p className="text-slate-500 dark:text-slate-400">Real-time overview of your wholesale distribution network</p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">₹{stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-emerald-600 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalOrders}</div>
                        <p className="text-xs text-blue-600 flex items-center mt-1">
                            <Activity className="h-3 w-3 mr-1" />
                            +15 new today
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Products in Stock</CardTitle>
                        <Package className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalProducts}</div>
                        <p className="text-xs text-indigo-600 flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            +4 added this week
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Retailers</CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalUsers}</div>
                        <p className="text-xs text-orange-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +2 signed up yesterday
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Recent Activity */}
                <Card className="col-span-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentOrders.length === 0 ? (
                                <p className="text-sm text-slate-500">No recent orders.</p>
                            ) : stats.recentOrders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <ShoppingCart className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{order.user?.shopName || order.userId}</p>
                                            <p className="text-xs text-slate-500">{order.items?.length || 0} items • ₹{order.totalAmount}</p>
                                        </div>
                                    </div>
                                    <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>{order.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock Alerts */}
                <Card className="col-span-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            Low Stock Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.lowStockProducts.length === 0 ? (
                                <p className="text-sm text-slate-500">No low stock alerts.</p>
                            ) : stats.lowStockProducts.map((product: any) => (
                                <div key={product.id} className="flex items-center justify-between p-2 border-b last:border-0 border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        {product.image && (
                                            <img src={product.image} alt={product.name} className="h-8 w-8 rounded object-cover" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">{product.name}</p>
                                            <p className="text-xs text-red-500 font-medium">Stock: {product.inventory?.quantity || 0} {product.unit}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="h-7 text-xs">Restock</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-500" />
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">AI Insights</h3>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {insights.map((insight, index) => (
                        <Card key={index} className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-none">
                            <CardHeader className="pb-2">
                                <div className={`w-8 h-8 rounded-lg ${insight.color.split(' ')[1]} flex items-center justify-center mb-2`}>
                                    <insight.icon className={`h-4 w-4 ${insight.color.split(' ')[0]}`} />
                                </div>
                                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">{insight.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {insight.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
