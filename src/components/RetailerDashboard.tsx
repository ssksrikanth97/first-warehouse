'use client';

import React, { useState } from 'react';
import { User, mockProducts, Product } from '@/lib/db-mock';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { LogOut, Search, ShoppingCart, Package, ShoppingBag } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { QuickCart } from './QuickCart';
import CheckoutModal from './CheckoutModal';
import { OrderTracking } from './OrderTracking';

import { ModeToggle } from './ModeToggle';

export default function RetailerDashboard({ user }: { user: User }) {
    const { logout } = useAuth();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const categories = ['All', ...Array.from(new Set(mockProducts.map(p => p.category)))];

    const filteredProducts = mockProducts.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.brand.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
                    <div>
                        <h1 className="text-xl font-bold text-indigo-900 dark:text-indigo-400">Hello, {user.name}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{user.shopName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <Button variant="ghost" size="sm" onClick={logout} className="text-slate-600 dark:text-slate-400">
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl p-4">
                <Tabs defaultValue="catalog" className="w-full">
                    <TabsList className="mb-8 grid w-full grid-cols-2 bg-indigo-50">
                        <TabsTrigger value="catalog" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            <ShoppingBag className="mr-2 h-4 w-4" /> Catalog
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
                            <Package className="mr-2 h-4 w-4" /> Orders
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="catalog" className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search products, brands..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <ScrollArea className="w-full whitespace-nowrap">
                                <div className="flex w-max space-x-2 pb-3">
                                    {categories.map(cat => (
                                        <Button
                                            key={cat}
                                            variant={selectedCategory === cat ? "default" : "outline"}
                                            size="sm"
                                            className="rounded-full"
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            {cat}
                                        </Button>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="orders">
                        <OrderTracking />
                    </TabsContent>
                </Tabs>
            </main>

            <QuickCart onCheckout={() => setIsCheckoutOpen(true)} />

            {isCheckoutOpen && <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />}
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(product.minOrderQuantity);

    return (
        <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                />
                <Badge variant="secondary" className="absolute bottom-2 left-2 bg-black/60 text-white backdrop-blur-sm">
                    {product.stock} in stock
                </Badge>
            </div>
            <CardHeader className="p-3 pb-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.brand}</p>
                <CardTitle className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-3 pt-2">
                <div className="flex items-baseline gap-1">
                    <p className="text-lg font-bold text-indigo-600">₹{product.wholesalePrice}</p>
                    <span className="text-[10px] text-slate-500">/ {product.unit}</span>
                </div>
                <p className="mt-1 text-[10px] font-medium text-emerald-600">Min Order: {product.minOrderQuantity} {product.unit}s</p>

                <div className="mt-3 flex items-center justify-between rounded-md border bg-slate-50 p-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-indigo-600"
                        onClick={() => setQuantity(Math.max(product.minOrderQuantity, quantity - product.minOrderQuantity))}
                    >
                        -
                    </Button>
                    <span className="text-xs font-bold">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-indigo-600"
                        onClick={() => setQuantity(quantity + product.minOrderQuantity)}
                    >
                        +
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
                <Button
                    variant="outline"
                    className="w-full border-indigo-600 text-xs text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    size="sm"
                    onClick={() => addToCart(product, quantity)}
                >
                    Add {quantity} to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
