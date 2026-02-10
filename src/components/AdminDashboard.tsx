'use client';

import React, { useState } from 'react';
import { User, mockProducts, Product, mockCategories, Category } from '@/lib/db-mock';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Package, LogOut, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

import { ModeToggle } from './ModeToggle';

import { AdminSidebar, AdminView } from './AdminSidebar';
import { SummaryView } from './admin-views/SummaryView';
import { InventoryView } from './admin-views/InventoryView';
import { CategoriesView } from './admin-views/CategoriesView';
import { OrdersView } from './admin-views/OrdersView';
import { CustomersView } from './admin-views/CustomersView';
import { SettingsView } from './admin-views/SettingsView';

export default function AdminDashboard({ user }: { user: User }) {
    const { logout } = useAuth();
    const [currentView, setCurrentView] = useState<AdminView>('summary');
    const [products, setProducts] = useState(mockProducts);
    const [categories, setCategories] = useState(mockCategories);

    const updateStock = (id: string, amount: number) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: p.stock + amount } : p));
    };

    const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
    const updateProduct = (updatedProduct: Product) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));

    const addCategory = (category: Category) => setCategories(prev => [...prev, category]);
    const updateCategory = (updatedCategory: Category) => setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));

    const renderView = () => {
        switch (currentView) {
            case 'summary': return <SummaryView />;
            case 'inventory': return (
                <InventoryView
                    products={products}
                    updateStock={updateStock}
                    addProduct={addProduct}
                    updateProduct={updateProduct}
                    categories={categories}
                />
            );
            case 'categories': return (
                <CategoriesView
                    categories={categories}
                    addCategory={addCategory}
                    updateCategory={updateCategory}
                />
            );
            case 'orders': return <OrdersView />;
            case 'customers': return <CustomersView />;
            case 'settings': return <SettingsView />;
            default: return <SummaryView />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-[1400px] items-center justify-between p-4 px-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                            <LayoutDashboard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Distributor Panel</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Welcome, {user.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600 dark:text-slate-400 hover:text-indigo-600">
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex max-w-[1400px]">
                <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
                <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500">
                    {renderView()}
                </main>
            </div>
        </div>
    );
}
