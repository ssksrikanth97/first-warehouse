"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { mockProducts, mockUsers } from '@/lib/db-mock'
import { Users, ShoppingBag, TrendingUp, Sparkles, AlertCircle, Zap } from 'lucide-react'

export function SummaryView() {
    const totalProducts = mockProducts.length
    const totalCustomers = mockUsers.filter(u => u.role === 'RETAILER').length

    // Simple AI Insights logic
    const insights = [
        {
            title: "Inventory Optimization",
            description: "3 products are nearing minimum order thresholds. Consider restock soon.",
            icon: AlertCircle,
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: "Customer Growth",
            description: "New retailer registrations are up 15% this week. Opportunity for referral program.",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Pricing Strategy",
            description: "Atta prices are fluctuating. AI suggests updating bulk slab prices.",
            icon: Zap,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Summary</h2>
                <p className="text-slate-500 dark:text-slate-400">Real-time overview of your wholesale distribution network</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">₹45,231.89</div>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">+20.1% from last month</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalCustomers}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active retailers in network</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Products</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalProducts}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">SKUs in inventory</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Orders</CardTitle>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">8 pending fulfillment</p>
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
                                <div className={`w-8 h-8 rounded-lg ${insight.bg} flex items-center justify-center mb-2`}>
                                    <insight.icon className={`h-4 w-4 ${insight.color}`} />
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
