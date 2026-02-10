"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Product, Category, mockProducts, mockCategories } from '@/lib/db-mock'

interface AdminContextType {
    products: Product[]
    categories: Category[]
    updateStock: (id: string, amount: number) => void
    addProduct: (product: Product) => void
    updateProduct: (updatedProduct: Product) => void
    addCategory: (category: Category) => void
    updateCategory: (updatedCategory: Category) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
    const [products, setProducts] = useState<Product[]>(mockProducts)
    const [categories, setCategories] = useState<Category[]>(mockCategories)

    const updateStock = (id: string, amount: number) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: p.stock + amount } : p))
    }

    const addProduct = (product: Product) => setProducts(prev => [...prev, product])
    const updateProduct = (updatedProduct: Product) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p))

    const addCategory = (category: Category) => setCategories(prev => [...prev, category])
    const updateCategory = (updatedCategory: Category) => setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c))

    return (
        <AdminContext.Provider value={{
            products,
            categories,
            updateStock,
            addProduct,
            updateProduct,
            addCategory,
            updateCategory
        }}>
            {children}
        </AdminContext.Provider>
    )
}

export function useAdmin() {
    const context = useContext(AdminContext)
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider')
    }
    return context
}
