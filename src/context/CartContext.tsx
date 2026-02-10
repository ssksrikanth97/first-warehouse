'use client';

import React, { createContext, useContext, useState } from 'react';
import { Product } from '@/lib/db-mock';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: Product, quantity: number) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
        ).filter(item => item.quantity > 0));
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.wholesalePrice * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
