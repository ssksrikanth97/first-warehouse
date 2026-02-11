"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    Tags,
    ShoppingCart,
    Users,
    Settings,
    ChevronRight
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type AdminView = 'summary' | 'inventory' | 'categories' | 'orders' | 'customers' | 'settings'

const navItems = [
    { id: 'summary', label: 'Summary', icon: LayoutDashboard, href: '/admin' },
    { id: 'inventory', label: 'Inventory', icon: Package, href: '/admin/inventory' },
    { id: 'categories', label: 'Categories', icon: Tags, href: '/admin/categories' },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, href: '/admin/orders' },
    { id: 'customers', label: 'Customers', icon: Users, href: '/admin/customers' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
] as const

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r bg-white dark:bg-slate-900 h-[calc(100vh-4.5rem)] sticky top-[4.5rem] hidden md:block">
            <div className="flex flex-col gap-2 p-4">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Button
                            key={item.id}
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-3 px-3",
                                isActive ? "bg-primary/5 text-primary/80 dark:bg-indigo-900/30 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"
                            )}
                            asChild
                        >
                            <Link href={item.href}>
                                <Icon className="h-4 w-4" />
                                <span className="flex-1 text-sm font-medium">{item.label}</span>
                                {isActive && <ChevronRight className="h-3 w-3" />}
                            </Link>
                        </Button>
                    )
                })}
            </div>
        </aside>
    )
}
